class Game < ActiveRecord::Base
	has_many :logs
	has_many :game_likes,
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
end
