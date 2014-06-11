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

	class << self
		def create_with_omniauth(auth)
    		create! do |user|
      			user.provider = auth["provider"]
      			user.uid = auth["uid"]
      			if user.provider == "facebook"
         			user.username = auth["info"]["name"]
      			else
         			user.username = auth["info"]["nickname"]
      			end
    		end
  		end
	end
end
