class User < ActiveRecord::Base
  require "kconv"
  require 'digest/sha2'

  include RandomName
  include EscapeLike
  include CostomUpload

  has_many :user_providers
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

  LIMIT          = 20
  ACTIVITY_LIMIT = 20

  scope :search, -> (username) {
    where("username LIKE ?", "%#{username}%")
  }

  attr_accessor :i_followed, :i_followered, :follow_num, :follower_num, :clip_x, :clip_y

	def update_with(user_params, clip = {})
  	user_params[:photo_path] = self.class.file_upload(user_params[:photo_path], "user", clip) unless user_params[:photo_path].nil?
  	self.update(user_params) ? true : false
  end

  def update_with_url(user_params, clip = {})
    user_params[:photo_path] = self.class.url_upload(user_params[:photo_path], "user", clip) unless user_params[:photo_path].nil?
    self.update(user_params)
    self
  end

  def check_follow(current_user)
    if Follow.where(from_user_id: current_user[:id]).pluck(:to_user_id).include?(self[:id])
      self.i_followed = true
    else
      self.i_followed = false
    end

    if Follow.exists?(to_user_id: current_user, from_user_id: self[:id])
      self.i_followered = true
    else
      self.i_followered = false
    end

    self.check_follow_num
  end

  def check_follow_num
    self.follow_num   = Follow.where(from_user_id: self[:id]).count
    self.follower_num = Follow.where(to_user_id: self[:id]).count
  end

  def follow_users
    Follow.where(from_user_id: self[:id]).map { |follow| follow.to_user }
  end

  def follower_users
    Follow.where(to_user_id: self[:id]).map { |follow| follow.from_user }
  end

  def create_password(password)
    self.salt     = self.class.new_salt
    self.password = self.class.crypt_password(password, self.salt.to_s)
  end

  def collect_password?(password)
    self.class.crypt_password(password, self.salt.to_s) == self.password
  end

  def connect_with_provider(current_provider)
    current_provider.update(user_id: self[:id])
  end


	class << self
    def create_with_provider(user_params, current_provider)
      user          = self.new
      user.create_password(user_params[:password])
      user.username = user_params[:username]
      begin
        ActiveRecord::Base.transaction do
          user.save!
          current_provider.update(user_id: user[:id])
          user
        end
      rescue
        false
      end
    end

    def search_with(username, current_user, page)
      offset = (page - 1) * LIMIT
      users  = self.search(self.escape(username)).offset(offset).limit(LIMIT).keep_if do |user|
        user.check_follow(current_user)
        user[:id] != current_user[:id]
      end

      count = self.search(self.escape(username)).keep_if{|user| user[:id] != current_user[:id]}.count

      {count: count, users: users}
    end

    def get_follows(current_user, user_id, page)
      offset = (page - 1) * LIMIT
      users  = Follow.where(from_user_id: user_id).offset(offset).limit(LIMIT).map do |follow|
        user = follow.to_user
        user.check_follow(current_user) if user
        user
      end

      users
    end

    def get_followers(current_user, user_id, page)
      offset = (page - 1) * LIMIT
      users  = Follow.where(to_user_id: user_id).offset(offset).limit(LIMIT).map do |follow|
        user = follow.from_user
        user.check_follow(current_user) if user
        user
      end

      users
    end

    def get_activity(current_user)
      users = User.where("created_at > ?", 2.week.ago).order("created_at DESC").limit(ACTIVITY_LIMIT).keep_if do |user|
        user.check_follow(current_user)
        user[:id] != current_user[:id] && !current_user.follows.pluck(:to_user_id).include?(user[:id])
      end

      users
    end

    def tmp_upload(tmp_data, clip)
      self.url_upload(tmp_data, "tmp", clip)
    end

    def crypt_password(password, salt)
      Digest::SHA2.hexdigest(password + salt)
    end

    def new_salt
      s = rand.to_s.tr('+', '.')
      s[0, if s.size > 32 then 32 else s.size end]
    end

    def authenticate(username, password)
      user = self.find_by(username: username)
      if user && user.collect_password?(password)
        user
      else
        false
      end
    end
	end
end
