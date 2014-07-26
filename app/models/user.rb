class User < ActiveRecord::Base
	has_many :posts
	has_many :logs
  has_many :games, :through => :logs
	has_many :game_likes
	has_many :post_likes
	has_many :follows, :foreign_key => "from_user_id"

	validates :username,
		presence: true,
		length: {maximum: 255}
	validates :introduction,
		length: {maximum: 255}
	validates :place,
		length: {maximum: 255}

  scope :search, -> (username) {
    where("username LIKE ?", "%#{username}%").select(:id, :username, :photo_path)
  }

  attr_accessor :i_followed, :follow_num, :follower_num

	def update_with(user_params)
  	self.class.upload(user_params) unless user_params[:photo_path].nil?
  	self.update(user_params) ? true : false
  end

  def update_with_url(user_params)
    self.class.upload_url(user_params) unless user_params[:photo_path].nil?
    self.update(user_params) ? true : false
  end

  def check_follow(current_user)
    if Follow.where(from_user_id: current_user[:id]).pluck(:to_user_id).include?(self[:id])
      self.i_followed = true
    else
      self.i_followed = false
    end

    self.follow_num = Follow.where(from_user_id: current_user[:id]).count
    self.follower_num = Follow.where(to_user_id: current_user[:id]).count
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

    def upload_url(user_params)
      data_url = user_params[:photo_path]

      case data_url
      when /png/
        extname = ".png"
      when /jpg|jpeg/
        extname = ".jpg"
      when /gif/
        extname = ".gif"
      end

      name = self.generate_random_name("alphabet", 10)
      photo_path = "#{name}#{extname}"
      File.open("public/user_photos/#{photo_path}", "wb") do |f|
        data_url = data_url.sub(/^.*,/, '')
        f.write(Base64.decode64(data_url))
      end
      user_params[:photo_path] = photo_path
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

    def search_with(username, current_user)
      users = self.search(self.escape_like(username))
      users = users.keep_if do |user|
        user[:id] != current_user[:id] && !current_user.follows.pluck(:to_user_id).include?(user[:id])
      end
      users
    end

    def escape_like(string)
      string.gsub(/[\\%_]/){|m| "\\#{m}"}
    end
	end
end
