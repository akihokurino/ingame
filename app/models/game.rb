class Game < ActiveRecord::Base
	has_many :logs
	has_many :game_likes,
	has_many :posts

	validates :title,
		presense: true,
		length: {maximum: 255}
	validates :photo_path,
		presense: true,
		length: {maximum: 255}
	validates :device,
		presense: true,
		length: {maximum: 255}
	validates :price,
		presense: true,
		numericality: true
	validates :maker,
		presense: true,
		length: {maximum: 255}
end
