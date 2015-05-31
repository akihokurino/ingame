class Game < ActiveRecord::Base
	require 'open-uri'
	require 'nokogiri'
	require 'kconv'
  require 'date'
  require "time"

	include RandomName
	include EscapeLike
  include CostomUpload
  include CompileColor

	has_many :logs, dependent: :destroy
	has_many :users, through: :logs
	has_many :game_likes, dependent: :destroy
	has_many :posts, dependent: :destroy
  has_many :game_gametags, dependent: :destroy
  has_many :gametags, through: :game_gametags
  has_many :game_urls, dependent: :destroy
  has_many :reviews, dependent: :destroy

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

	attr_accessor :i_registed, :my_status_id, :my_rate, :avg_rate, :formated_release_day

  LIMIT         = 20
  RANKING_LIMIT = 5
  ROOT_DIR      = File.expand_path "../../../", __FILE__

  default_scope {
    includes(:gametags)
  }

  scope :search, -> (title) {
    where("title LIKE ?", "%#{title}%")
  }

  after_destroy :destroy_resources

  def format_datetime
    self.formated_release_day = Time.parse(self[:release_day].to_s).strftime("%Y年 %m月 %d日")
  end

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

  def get_most_used_color
    if self[:photo_path]
      path = "#{Rails.root}/public/game_photos/#{self[:photo_path]}"
    elsif self[:photo_url]
      path = self[:photo_url]
    else
      path = "#{Rails.root}/public/game_photos/default.png"
    end

    compiler = Compiler.new path
    compiler.compile_histogram
    compiler.most_used_color
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
    game_params[:photo_path] = self.class.file_upload(game_params[:photo_path], "game") unless game_params[:photo_path].nil?
    self.update game_params
  end

	class << self
    def custom_query(current_user, params)
      case params[:type]
      when "activity"
        self.get_ranking current_user
      else
        self.none
      end
    end

    def search_with(current_user, params)
      search_title  = params[:search_title]
      search_tag_id = params[:search_tag_id]
      search_device = params[:search_device]
      page          = params[:page].to_i
      return self.none if page < 1

      offset = (page - 1) * LIMIT

      unless search_title.nil?
        games = self.search(self.escape(search_title)).order("created_at DESC").offset(offset).limit(LIMIT).map do |game|
          unless current_user[:id].nil?
            game.check_rate current_user
            game.check_regist current_user
          end

          game
        end

        count = self.search(self.escape(search_title)).count

        return {count: count, games: games}
      end

      unless search_tag_id.nil?
        games = Gametag.find(search_tag_id).games.order("created_at DESC").offset(offset).limit(LIMIT).map do |game|
          unless current_user[:id].nil?
            game.check_rate current_user
            game.check_regist current_user
          end

          game
        end

        current_tag = Gametag.find search_tag_id
        count       = current_tag.games.count

        return {count: count, games: games, tag: current_tag[:name]}
      end

      unless search_device.nil?
        games = Game.where(device: search_device).order("created_at DESC").offset(offset).limit(LIMIT).map do |game|
          unless current_user[:id].nil?
            game.check_rate current_user
            game.check_regist current_user
          end

          game
        end

        count = Game.where(device: search_device).count

        return {count: count, games: games}
      end
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

    def get_ranking(current_user)
      Log.where("created_at > ?", 4.week.ago).select(:game_id).group_by { |log| log[:game_id] }.values.sort { |a, b| a.length <=> b.length }.last(RANKING_LIMIT).reverse.map do |logs|

        unless current_user[:id].nil?
          logs[0].game.check_rate current_user
          logs[0].game.check_regist current_user
        end

        logs[0].game
      end
    end

    def get_device_ranking
      limit   = 20
      offset  = 0
      devices = []
      result  = []

      fetch_recent_devices = Proc.new do |limit, offset|
        Log.includes(:game).order("created_at DESC").offset(offset).limit(limit).select(:game_id).group_by { |log| log[:game_id] }.values.sort { |a, b| a.length <=> b.length }.reverse.each do |logs|
          devices << logs[0].game[:device]
        end

        devices.uniq
      end

      fetch_recent_devices.call limit, offset

      max_log_count = Log.count
      result = loop do
        if result.length > 15
          break result[0, 15]
        else
          result = fetch_recent_devices.call limit, offset
        end

        limit  += 20
        offset += 20

        break result if max_log_count < offset
      end
    end

    def get_all_devices
      self.select(:device).distinct.map { |game| {name: game[:device]} }
    end
	end

  private
  def destroy_resources
    system "rm #{ROOT_DIR}/public/game_photos/#{self[:photo_path]}" unless self[:photo_path].nil?
  end
end
