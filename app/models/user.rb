class User < ActiveRecord::Base
  include RandomName
  include EscapeLike
  include CostomUpload

	has_many :posts
	has_many :logs
  has_many :games, :through => :logs
	has_many :game_likes
	has_many :post_likes
	has_many :follows, :foreign_key => "from_user_id"
  has_many :notifications, :foreign_key => "to_user_id"

	validates :username,
		presence: true,
		length: {maximum: 255}
	validates :introduction,
		length: {maximum: 255}
	validates :place,
		length: {maximum: 255}

  LIMIT = 20

  scope :search, -> (username) {
    where("username LIKE ?", "%#{username}%").select(:id, :username, :photo_path)
  }

  attr_accessor :i_followed, :follow_num, :follower_num, :clip_width, :clip_height


	def update_with(user_params, clip = {})
  	user_params[:photo_path] = self.class.file_upload(user_params[:photo_path], "user", clip) unless user_params[:photo_path].nil?
  	self.update(user_params) ? true : false
  end

  def update_with_url(user_params, clip = {})
    user_params[:photo_path] = self.class.url_upload(user_params[:photo_path], "user", clip) unless user_params[:photo_path].nil?
    self.update(user_params) ? true : false
  end

  def check_follow(current_user)
    if Follow.where(from_user_id: self[:id]).pluck(:to_user_id).include?(self[:id])
      self.i_followed = true
    else
      self.i_followed = false
    end

    self.follow_num   = Follow.where(from_user_id: self[:id]).count
    self.follower_num = Follow.where(to_user_id: self[:id]).count
  end

  def follow_users
    Follow.where(from_user_id: self[:id]).map { |follow| follow.to_user }
  end

  def follower_users
    Follow.where(to_user_id: self[:id]).map { |follow| follow.from_user }
  end

	class << self
		def create_with_omniauth(auth)
    	create! do |user|
      	user.provider = auth["provider"]
      	user.uid      = auth["uid"]
        user.token    = auth["credentials"]["token"]
        case user.provider
        when "facebook"
          user.username = auth["info"]["name"]
        when "twitter"
          user.username     = auth["info"]["nickname"]
          user.secret_token = auth["credentials"]["secret"]
      	end
    	end
  	end

    def search_with(username, current_user, page)
      offset = (page - 1) * LIMIT
      users  = self.search(self.escape(username)).offset(offset).limit(LIMIT)
      users  = users.keep_if do |user|
        user[:id] != current_user[:id] && !current_user.follows.pluck(:to_user_id).include?(user[:id])
      end

      users
    end

    def get_follows(current_user, user_id, page)
      offset = (page - 1) * LIMIT
      users  = Follow.where(from_user_id: user_id).offset(offset).limit(LIMIT).map do |follow|
        follow.to_user
      end

      users
    end

    def get_followers(current_user, user_id, page)
      offset = (page - 1) * LIMIT
      users  = Follow.where(to_user_id: user_id).offset(offset).limit(LIMIT).map do |follow|
        follow.from_user
      end

      users
    end
	end
end
