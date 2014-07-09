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

	def update_with(user_params)
  	self.class.upload(user_params) unless user_params[:photo_path].nil?
  	self.update(user_params) ? true : false
  end

	class << self
		def create_with_omniauth(auth)
    	create! do |user|
      	user.provider = auth["provider"]
      	user.uid      = auth["uid"]

      	if user.provider == "facebook"
         	user.username = auth["info"]["name"]
      	elsif user.provider == "twitter"
         	user.username = auth["info"]["nickname"]
      	end
    	end
  	end

  	def upload(user_params)
  		file  = user_params[:photo_path]
  		name  = file.original_filename
  		perms = [".jpg", ".jpeg", ".gif", ".png"]
  		if perms.include?(File.extname(name).downcase) && file.size < 1.megabyte
  			photo_path = self.generate_random_name("alphabet", 10) + name
  			File.open("public/user_photos/#{photo_path}", "wb") do |f|
  				f.write(file.read)
  			end
  			user_params[:photo_path] = photo_path
  		else

  		end
  	end

  	def generate_random_name(type = "alphabet", size = 8)
			char_list_str = []
			char_list_str = ("a".."z").to_a if type == "alphabet"
			char_list_str = (0..9).to_a if type == "number"

			return false if size < 1

			if size == 1
				char_list_str.sample
			else
				char_list_str.sort_by{rand}.take(size).join("")
			end
		end
	end
end
