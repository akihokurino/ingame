class Post < ActiveRecord::Base
  include RandomName
  include CostomUpload

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
    presence: true
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
      photo_path = self.class.url_upload(file, "post")
      PostPhoto.create!(post_id: self[:id], photo_path: photo_path)
    end
  end

  def i_like?(current_user_id)
    self.i_liked = self.post_likes.pluck(:user_id).include?(current_user_id) ? true : false
  end

  def facebook(current_user)
    current_provider = nil
    current_user.user_providers.each do |user_provider|
      current_provider = user_provider if user_provider[:service_name] == "facebook"
    end

    return false unless current_provider

    me = FbGraph::User.me current_provider[:token]
    me.feed!(
      :message     => self[:text],
      #:picture    => 'https://graph.facebook.com/matake/picture',
      #:link       => 'https://github.com/bussorenre',
      :name        => "Gameful",
      :description => "Posted from Gameful"
    )
  end

  def twitter(current_user)
    current_provider = nil
    current_user.user_providers.each do |user_provider|
      current_provider = user_provider if user_provider[:service_name] == "twitter"
    end

    return false unless current_provider

    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "o0oeDXJ131ufgroZv1ur7sZ6E"
      config.consumer_secret     = "e3yyRbH2s4eI4AuFrtMMKwxGTi7ZHF00qslNWbYKzClMWgmWJf"
      config.access_token        = current_provider[:token]
      config.access_token_secret = current_provider[:secret_token]
    end

    client.update self[:text]
  end

  def datetime
    self[:created_at].strftime("%Y/%m/%d %H:%M:%S")
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
    def get_all_posts(current_user_id, page)
      offset       = (page - 1) * LIMIT
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      follower_ids << current_user_id
      posts        = self.where(user_id: follower_ids).all_include.offset(offset).limit(LIMIT)
      posts        = self.i_like?(posts, current_user_id)
      posts.map do |post|
        post.post_comments = PostComment.i_like?(post.post_comments, current_user_id)
        post
      end
    end

    def get_user_posts(current_user_id, user_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(user_id: user_id).all_include.offset(offset).limit(LIMIT)
      posts  = self.i_like?(posts, current_user_id)
      posts.map do |post|
        post.post_comments = PostComment.i_like?(post.post_comments, current_user_id)
        post
      end
    end

    def get_all_posts_of_game(current_user_id, game_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(game_id: game_id).all_include.offset(offset).limit(LIMIT)
      posts  = self.i_like?(posts, current_user_id)
      posts.map do |post|
        post.post_comments = PostComment.i_like?(post.post_comments, current_user_id)
        post
      end
    end

    def get_follower_posts_of_game(current_user_id, game_id, page)
      offset       = (page - 1) * LIMIT
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      posts        = self.where(game_id: game_id, user_id: follower_ids).all_include.offset(offset).limit(LIMIT)
      posts        = self.i_like?(posts, current_user_id)
      posts.map do |post|
        post.post_comments = PostComment.i_like?(post.post_comments, current_user_id)
        post
      end
    end

    def get_liker_posts_of_game(current_user_id, game_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(game_id: game_id).all_include.offset(offset).limit(LIMIT).reorder("post_likes_count DESC")
      posts  = self.i_like?(posts, current_user_id)
      posts.map do |post|
        post.post_comments = PostComment.i_like?(post.post_comments, current_user_id)
        post
      end
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

      generateText = Proc.new do |status_id|
        case status_id
        when 1
          "#{current_game[:title]}を気になっています"
        when 2
          "#{current_game[:title]}で遊んでいます"
        when 3
          "#{current_game[:title]}を遊び終わりました"
        when 4
          "#{current_game[:title]}を積んでいます"
        end
      end

      case type
      when "create"
        params[:text] = "#{current_game[:title]}をマイゲームに追加しました"
      when "status_update"
        current_status = Status.find log_params[:status_id]
        params[:text]  = generateText.call current_status[:id]
      when "rate_update"
        current_rate  = log_params[:rate]
        params[:text] = "#{current_game[:title]}の評価を#{current_rate}に変更しました"
      end

      self.create params
    end
  end
end
