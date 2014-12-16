class Game < ActiveRecord::Base
	require 'open-uri'
	require 'nokogiri'
	require 'kconv'

	include RandomName
	include EscapeLike

	has_many :logs
	has_many :users, :through => :logs
	has_many :game_likes
	has_many :posts
  has_many :game_gametags
  has_many :gametags, :through => :game_gametags
  has_many :game_devices
  has_many :devices, :through => :game_devices

  default_scope { includes(:gametags).includes(:devices) }

	validates :title,
		presence: true,
		length: {maximum: 255}
	validates :maker,
		length: {maximum: 255}

	attr_accessor :i_registed, :my_status_id, :my_rate, :avg_rate

  LIMIT = 20

  scope :search, -> (title) {
    where("title LIKE ?", "%#{title}%")
  }

	def check_regist(current_user)
		self.i_registed = current_user.logs.pluck(:game_id).include?(self[:id]) ? true : false

		if self.i_registed
      begin
			  self.my_status_id = self.logs.find_by(user_id: current_user[:id]).status_id
      rescue Exception
        self.my_status_id = nil
      end
		else
      self.my_status_id = nil
    end
	end

	def check_rate(current_user)
		begin
			my_rate = current_user.logs.find_by(game_id: self[:id]).rate
		rescue Exception
			my_rate = nil
		end

		self.my_rate = my_rate
		sum_rate     = 0
		sum_log      = 0
		Log.where(game_id: self[:id]).each do |log|
			unless log.rate.nil?
				sum_rate += log.rate.to_i
				sum_log  += 1
			end
		end

		begin
			self.avg_rate = sprintf("%d", (sum_rate / sum_log))
		rescue
			self.avg_rate = 0
		end
	end

	class << self
    def search_with(search_title, page, current_user)
      offset = (page - 1) * LIMIT
      games  = self.search(self.escape(search_title)).order("created_at DESC").offset(offset).limit(LIMIT).map do |game|
        game.check_rate(current_user)
        game.check_regist(current_user)
        game
      end

      count = self.search(self.escape(search_title)).count

      {count: count, games: games}
    end

    def create_from_scraping(hash)
      game_attr = {
        title:       1,
        photo_url:   1,
        maker:       1,
        provider:    1,
        provider_id: 1,
        release_day: 1,
        wiki:        1
      }

      tags    = hash[:tags].map { |tag| Gametag.find_or_create_by! name: tag }
      devices = hash[:devices].map { |device| Device.find_or_create_by! name: device }

      already = Game.find_by(title: hash[:title], provider: hash[:provider])

      if already
        puts "This is already exists #{hash[:title]} from [#{hash[:provider]}]"
        return false
      end

      puts "creating #{hash[:title]} from [#{hash[:provider]}]"

      game = Game.find_or_create_by! hash.select{ |key, _| game_attr[key] }

      tags.each do |tag|
        GameGametag.find_or_create_by! game: game, gametag: tag
      end

      devices.each do |device|
        GameDevice.find_or_create_by! game: game, device: device
      end

      true
    end
	end
end
