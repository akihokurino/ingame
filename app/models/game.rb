class Game < ActiveRecord::Base
	require 'open-uri'
	require 'nokogiri'
	require 'kconv'

	has_many :logs
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
	validates :price,
		presence: true
	validates :maker,
		length: {maximum: 255}

	class << self
		def get_from_amazon(url)
			result = {}
			html = open(url){|f| f.read }
			doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
			doc.css("#btAsinTitle").each do |node|
				result[:title] = node.children.text
			end
			doc.css("#platform-information .byLinePipe").each do |node|
				result[:device] = node.next.text
				#result[:device] = node.children[2].text
			end
			doc.css(".parseasinTitle + a").each do |node|
				result[:maker] = node.children.text
			end
			doc.css("#actualPriceValue .priceLarge").each do |node|
				result[:price] = node.children.text
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
	end
end
