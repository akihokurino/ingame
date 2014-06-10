class User < ActiveRecord::Base
	has_many :posts
	has_many :logs
	has_many :game_likes
	has_many :post_likes
	has_many :follows

	validates :username,
		presence: true,
		length: {maximum: 255}
	validates :introduction,
		length: {maximum: 255}
	validates :place,
		length: {maximum: 255}
end
