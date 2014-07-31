class Game < ActiveRecord::Base
	require 'open-uri'
	require 'nokogiri'
	require 'kconv'

	has_many :logs
	has_many :users, :through => :logs
	has_many :game_likes
	has_many :posts

	validates :title,
		presence: true,
		length: {maximum: 255}
	validates :photo_path,
		presence: true,
		length: {maximum: 255}
	validates :device,
		length: {maximum: 255}
	validates :maker,
		length: {maximum: 255}

	attr_accessor :i_registed, :my_status_id, :my_rate, :avg_rate

	LIMIT = 20

	def check_regist(current_user)
		self.i_registed = current_user.logs.pluck(:game_id).include?(self[:id]) ? true : false

		if self.i_registed
			self.my_status_id = self.logs.find_by(user_id: current_user[:id]).status_id
		end
	end

	def check_rate(current_user)
		begin
			my_rate = current_user.logs.find_by(game_id: self[:id]).rate
		rescue Exception
			my_rate = nil
		end

		self.my_rate = my_rate

		sum_rate = 0
		sum_log = 0
		Log.where(game_id: self[:id]).each do |log|
			unless log.rate.nil?
				sum_rate += log.rate.to_i
				sum_log += 1
			end
		end

		begin
			self.avg_rate = (sum_rate / sum_log).floor
		rescue
			self.avg_rate = 0
		end
	end

	class << self
		def get_from_amazon(url)
			result = {}
			begin
				html = open(url){|f| f.read }
			rescue Exception
				html = open(url, "r:binary").read.encode("utf-8", "euc-jp", invalid: :replace, undef: :replace)
			end

			begin
				doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
			rescue Exception
				doc = Nokogiri::HTML.parse(html, nil)
			end

			doc.css("#btAsinTitle").each do |node|
				result[:title] = node.children.text
			end
			doc.css("#platform-information .byLinePipe").each do |node|
				result[:device] = node.next.text
			end
			doc.css(".parseasinTitle + a").each do |node|
				result[:maker] = node.children.text
			end
			doc.css("#prodImageCell img").each do |node|
				result[:photo_path] = node.attributes["src"].value
			end

			result
		end

		def find_or_create!(result)
			if self.exists?(title: result[:title])
				game = self.find_by(title: result[:title])
			else
				result[:release_day] = result[:release_day]
				self.create!(result)
				game = self.last
			end

			game
		end

		def search(search_title, page, current_user)
			offset = (page - 1) * LIMIT
			self.where("title LIKE ?", "%#{self.escape_like(search_title)}%").order("created_at DESC").offset(offset).limit(LIMIT).keep_if do |game|
				!current_user.logs.pluck(:game_id).include?(game.id)
			end
		end

		def escape_like(string)
	  	string.gsub(/[\\%_]/){|m| "\\#{m}"}
		end
	end
end
