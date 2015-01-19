class Game < ActiveRecord::Base
	require 'open-uri'
	require 'nokogiri'
	require 'kconv'

	include RandomName
	include EscapeLike
  include CostomUpload

	has_many :logs, dependent: :destroy
	has_many :users, through: :logs
	has_many :game_likes, dependent: :destroy
	has_many :posts, dependent: :destroy
  has_many :game_gametags, dependent: :destroy
  has_many :gametags, through: :game_gametags
  has_many :game_urls, dependent: :destroy

  default_scope { includes(:gametags) }

	validates :title,
		presence: true,
		length: {maximum: 255}
	validates :device,
		length: {maximum: 255}
	validates :maker,
		length: {maximum: 255}
  validates :price,
    length: {maximum: 255}
  validates :provider,
    presence: true,
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

  def create_tags(tags)
    tags = tags.keep_if { |tag| !tag.blank? }
    tags = tags.map { |tag| Gametag.find_or_create_by! name: tag }
    tags.each do |tag|
      GameGametag.find_or_create_by! game: self, gametag: tag
    end
  end

  def create_urls(urls)
    urls.each do |url|
      GameUrl.create game_id: self[:id], text: url unless url.blank?
    end
  end

  def update_with_thumbnail(game_params)
    game_params[:photo_path] = self.class.file_upload game_params[:photo_path], "game"
    self.update game_params
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
        title:        1,
        photo_url:    1,
        maker:        1,
        device:       1,
        provider:     1,
        provider_id:  1,
        provider_url: 1,
        amazon_url:   1,
        game_html:    1,
        release_day:  1,
        wiki:         1,
        price:        1
      }

      tags        = hash[:tags].map { |tag| Gametag.find_or_create_by! name: tag }
      create_flag = false

      for device in hash[:devices]
        already = Game.find_by(title: hash[:title], device: device, provider: hash[:provider])

        if already
          puts "This is already exists #{hash[:title]} (#{device}) from [#{hash[:provider]}]"
          next
        end

        puts "creating #{hash[:title]} (#{device}) from [#{hash[:provider]}]"
        create_flag = true
        game        = Game.find_or_create_by! hash.select{ |key, _| game_attr[key] }.merge(device: device)
        tags.each do |tag|
          GameGametag.find_or_create_by! game: game, gametag: tag
        end

        hash[:game_urls].each do |url|
          GameUrl.create game_id: game[:id], text: url
        end
      end

      create_flag
    end
	end
end
