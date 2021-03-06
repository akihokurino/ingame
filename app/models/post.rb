class Post < ActiveRecord::Base
  include RandomName
  include CostomUpload
  include PostTwitter
  include PostFacebook

  belongs_to :user, counter_cache: true
  belongs_to :game, counter_cache: true
  belongs_to :log
  belongs_to :post_type
  has_many   :post_likes, dependent: :destroy
  has_many   :post_photos, dependent: :destroy
  has_many   :post_comments, dependent: :destroy
  has_many   :post_urls, dependent: :destroy

  validates :user_id,
    presence: true,
    numericality: true
  validates :game_id,
    presence: true,
    numericality: true
  validates :log_id,
    presence: true,
    numericality: true
  validates :text,
    presence: true,
    allow_blank: true
  validates :post_likes_count,
    numericality: true
  validates :post_comments_count,
    numericality: true

  attr_accessor :i_liked

  LIMIT = 20

  default_scope {
    order("created_at DESC")
  }

  scope :all_include, -> {
    includes(:game).includes(:log).includes(:user).includes(:post_likes).includes(:post_photos).includes(:post_comments).includes(:post_type)
  }

  def save_with_url(files)
    files.each do |file|
      photo_path = self.class.url_upload file, "post"
      PostPhoto.create! post_id: self[:id], photo_path: photo_path
    end
  end

  def i_like?(current_user_id)
    self.i_liked = self.post_likes.pluck(:user_id).include?(current_user_id) ? true : false
  end

  def facebook(current_user)
    if user_provider = current_user.user_providers.find_by(service_name: "facebook")
      self.post_facebook user_provider
    end
  end

  def twitter(current_user)
    if user_provider = current_user.user_providers.find_by(service_name: "twitter")
      text = "#{self[:text]} - #{self.game[:title]} http://gamr.jp/posts/#{self[:id]} #gamr"
      self.post_twitter user_provider, text
    end
  end

  def datetime
    self[:created_at].strftime "%Y/%m/%d %H:%M:%S"
  end

  def relative_time
    current_time = Time.now.to_i
    created_time = self[:created_at].to_i
    diff_time    = (current_time - created_time).floor
    diff_day     = (diff_time / (60 * 60 * 24)).floor
    diff_hour    = (diff_time / (60 * 60)).floor
    diff_minutes = (diff_time / 60).floor
    diff_second  = diff_time.floor

    year, month, day, hour, min, sec = self.datetime.split(/[^0-9]/)

    if diff_day > 1
      date = "#{year}年#{month}月#{day}日 #{hour}時#{min}分"
    elsif diff_day > 0
      date = "昨日 #{hour}時#{min}分"
    else
      if diff_hour >= 1
        date = "#{diff_hour}時間前"
      elsif diff_minutes >= 1
        date = "#{diff_minutes}分前"
      else
        date = "#{diff_second}秒前"
      end
    end
  end

  class << self
    def custom_query(current_user, params)
      type    = params[:type]
      game_id = params[:game_id]
      page    = params[:page].to_i
      return self.none if page < 1

      case type
      when "user"
        self.get_user_posts current_user[:id], params[:user_id], page
      when "all_of_game"
        self.get_all_posts_of_game current_user[:id], game_id, page
      when "follower_of_game"
        self.get_follower_posts_of_game current_user[:id], game_id, page
      when "liker_of_game"
        self.get_liker_posts_of_game current_user[:id], game_id, page
      else
        self.get_all_posts current_user[:id], page
      end
    end

    def get_all_posts(current_user_id, page)
      return self.none if current_user_id.nil?

      offset       = (page - 1) * LIMIT
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      follower_ids << current_user_id
      posts        = self.where(user_id: follower_ids).all_include.offset(offset).limit(LIMIT)
      posts        = self.i_like? posts, current_user_id
      posts.map do |post|
        post.post_comments = PostComment.i_like? post.post_comments, current_user_id
        post
      end

      posts
    end

    def get_user_posts(current_user_id, user_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(user_id: user_id).all_include.offset(offset).limit(LIMIT)

      unless current_user_id.nil?
        posts  = self.i_like? posts, current_user_id
        posts.map do |post|
          post.post_comments = PostComment.i_like? post.post_comments, current_user_id
          post
        end
      end

      posts
    end

    def get_all_posts_of_game(current_user_id, game_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(game_id: game_id).where.not(post_type_id: 3).all_include.offset(offset).limit(LIMIT)

      unless current_user_id.nil?
        posts  = self.i_like? posts, current_user_id
        posts.map do |post|
          post.post_comments = PostComment.i_like? post.post_comments, current_user_id
          post
        end
      end

      posts
    end

    def get_follower_posts_of_game(current_user_id, game_id, page)
      return self.none if current_user_id.nil?

      offset       = (page - 1) * LIMIT
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      posts        = self.where(game_id: game_id, user_id: follower_ids).where.not(post_type_id: 3).all_include.offset(offset).limit(LIMIT)
      posts        = self.i_like? posts, current_user_id
      posts.map do |post|
        post.post_comments = PostComment.i_like? post.post_comments, current_user_id
        post
      end

      posts
    end

    def get_liker_posts_of_game(current_user_id, game_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(game_id: game_id).where.not(post_type_id: 3).all_include.offset(offset).limit(LIMIT).reorder("post_likes_count DESC")

      unless current_user_id.nil?
        posts  = self.i_like? posts, current_user_id
        posts.map do |post|
          post.post_comments = PostComment.i_like? post.post_comments, current_user_id
          post
        end
      end

      posts
    end

    def i_like?(post_args, current_user_id)
      post_args.map do |post|
        post.i_liked = post.post_likes.pluck(:user_id).include?(current_user_id) ? true : false
        post
      end
    end

    def create_activity(log_params, log_id, type)
      current_game = Game.find log_params[:game_id]
      params = {
        post_type_id: 2,
        user_id:      log_params[:user_id],
        game_id:      log_params[:game_id],
        log_id:       log_id
      }

      if current_game[:title].length > 50
        current_game[:title].slice! 0, 50
        current_game[:title] += "..."
      end

      generateText = Proc.new do |status_id|
        case status_id
        when 1
          "#{current_game[:title]}が気になっています"
        when 2
          "#{current_game[:title]}を遊んでいます"
        when 3
          "#{current_game[:title]}を遊び終わりました"
        when 4
          "#{current_game[:title]}を積んでいます"
        end
      end

      case type
      when "create"
        current_status = Status.find log_params[:status_id]
        params[:text]  = generateText.call current_status[:id]
      when "status_update"
        current_status = Status.find log_params[:status_id]
        params[:text]  = generateText.call current_status[:id]
      when "rate_update"
        current_rate   = log_params[:rate]
        params[:text]  = "#{current_game[:title]}の評価を#{current_rate}に変更しました"
      end

      self.create params
    end

    def create_review(review, current_user_id)
      params = {
        post_type_id: 3,
        user_id:      review[:user_id],
        game_id:      review[:game_id],
        log_id:       review[:log_id],
        text:         ""
      }

      self.create! params
    end
  end
end
