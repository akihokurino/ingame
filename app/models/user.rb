class User < ActiveRecord::Base
  require "kconv"
  require 'digest/sha2'

  include RandomName
  include EscapeLike
  include CostomUpload
  include CompileColor

  has_many :user_providers, dependent: :destroy
	has_many :posts, dependent: :destroy
  has_many :post_comments, dependent: :destroy
  has_many :reviews, dependent: :destroy
	has_many :logs, dependent: :destroy
  has_many :games, through: :logs
	has_many :game_likes, dependent: :destroy
	has_many :post_likes, dependent: :destroy
  has_many :post_comment_likes, dependent: :destroy
	has_many :follows, class_name: "Follow", :foreign_key => "from_user_id", dependent: :destroy
  has_many :followers, class_name: "Follow", :foreign_key => "to_user_id", dependent: :destroy
  has_many :received_notifications, class_name: "Notification", :foreign_key => "to_user_id", dependent: :destroy
  has_many :send_notifications, class_name: "Notification", :foreign_key => "from_user_id", dependent: :destroy

	validates :username,
		presence: true,
    uniqueness: true,
		length: {maximum: 255}
  validates :password,
    presence: true,
    length: {maximum: 255, minimum: 8}
  validates :salt,
    presence: true
	validates :introduction,
		length: {maximum: 255}
	validates :place,
		length: {maximum: 255}
  validates :logs_count,
    numericality: true
  validates :posts_count,
    numericality: true

  LIMIT          = 20
  ACTIVITY_LIMIT = 20
  ROOT_DIR       = File.expand_path "../../../", __FILE__

  scope :search, -> (username) {
    where("username LIKE ?", "%#{username}%")
  }

  attr_accessor :i_followed, :i_followered, :follow_num, :follower_num, :clip_x, :clip_y

  after_destroy :destroy_resources

  def current_providers
    providers = {
      facebook: nil,
      twitter:  nil
    }

    self.user_providers.each do |provider|
      case provider.service_name
      when "facebook"
        providers[:facebook] = provider
      when "twitter"
        providers[:twitter] = provider
      end
    end

    providers.values_at :facebook, :twitter
  end

	def update_with_file(user_params, clip = {})
    prev_photo_path = nil
    begin
      unless user_params[:photo_path].nil?
        user_params[:photo_path] = self.class.file_upload user_params[:photo_path], "user", clip
        prev_photo_path          = self[:photo_path]
      end
    rescue
      user_params[:photo_path] = self[:photo_path]
    end
    user_params[:username] = user_params[:username].gsub(/(\s|　)+/, '') unless user_params[:username].nil?

  	if self.update(user_params)
      system "rm #{ROOT_DIR}/public/user_photos/#{prev_photo_path}" unless /default/ =~ prev_photo_path
      true
    else
      false
    end
  end

  def update_with_url(user_params, clip = {})
    prev_photo_path = nil
    unless user_params[:photo_path].nil?
      user_params[:photo_path] = self.class.url_upload user_params[:photo_path], "user", clip
      prev_photo_path          = self[:photo_path]
    end
    user_params[:username] = user_params[:username].gsub(/(\s|　)+/, '') unless user_params[:username].nil?

    if self.update(user_params)
      system "rm #{ROOT_DIR}/public/user_photos/#{prev_photo_path}" unless /default/ =~ prev_photo_path
    end

    self
  end

  def check_follow(current_user)
    self.i_followed   = current_user.follows.pluck(:to_user_id).include?(self[:id]) ? true : false
    self.i_followered = current_user.followers.pluck(:from_user_id).include?(self[:id]) ? true : false
    self.check_follow_num
  end

  def check_follow_num
    self.follow_num   = self.follows.count
    self.follower_num = self.followers.count
  end

  def follow_users
    self.follows.map { |follow| follow.to_user }
  end

  def follower_users
    self.followers.map { |follow| follow.from_user }
  end

  def collect_password?(password)
    self.class.crypt_password(password, self.salt) == self.password
  end

  def connect_with_provider(current_provider)
    current_provider.update(user_id: self[:id])
  end

  def get_most_used_color
    compiler = Compiler.new "#{Rails.root}/public/user_photos/#{self[:photo_path]}"
    compiler.compile_histogram
    compiler.most_used_color
  end

	class << self
    def search_with(username, current_user, page)
      offset = (page - 1) * LIMIT
      users  = self.search(self.escape(username)).offset(offset).limit(LIMIT).keep_if do |user|
        user.check_follow(current_user) unless current_user[:id].nil?
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

    def create_with_provider(user_params, current_provider)
      self.create_password user_params
      user_params[:photo_path] = current_provider[:photo_path] if current_provider[:photo_path]
      begin
        ActiveRecord::Base.transaction do
          user = self.create! user_params
          current_provider.update! user_id: user[:id]
          user
        end
      rescue
        false
      end
    end

    def create_password(user_params)
      user_params[:salt]     = self.new_salt
      user_params[:password] = self.crypt_password user_params[:password], user_params[:salt]
    end

    def crypt_password(password, salt)
      Digest::SHA2.hexdigest(password + salt)
    end

    def new_salt
      s = rand.to_s.tr('+', '.')
      s[0, if s.size > 32 then 32 else s.size end]
    end

    def authenticate(username, password)
      user = self.find_by username: username
      if user && user.collect_password?(password)
        user
      else
        false
      end
    end

    def get_liked(current_user, post_id)
      post = Post.find post_id
      self.where id: post.post_likes.pluck(:user_id)
    end
	end

  private
  def destroy_resources
    system "rm #{ROOT_DIR}/public/user_photos/#{self[:photo_path]}" unless /default/ =~ self[:photo_path]
  end
end
