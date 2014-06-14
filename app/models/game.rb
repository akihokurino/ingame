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
		presence: true,
		length: {maximum: 255}
	validates :price,
		presence: true,
		numericality: true
	validates :maker,
		presence: true,
		length: {maximum: 255}

	def get_from_amazon(url)
		html = open(url){|f| f.read }
		doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
		doc.css("#btAsinTitle").each do |node|
			self[:title] = node.children.text
		end
		doc.css("#platform-information").each do |node|
			self[:device] = node.children[2].text
		end
		doc.css(".parseasinTitle").each do |node|
			node.children.each do |node|
				if node.name == "span"
					self[:maker] = node.children.text
					break
				end
			end
		end
		doc.css("#listPriceValue").each do |node|
			self[:price] = node.children.text
		end
		doc.css("#prodImageCell img").each do |node|
			self[:photo_path] = node.attributes["src"].value
		end
	end
end
