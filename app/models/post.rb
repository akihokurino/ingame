class Post < ActiveRecord::Base
  include RandomName
  include CostomUpload

  belongs_to :user, counter_cache: true
  belongs_to :game, counter_cache: true
  belongs_to :log
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
  validates :text,
    presence: true

  attr_accessor :i_liked

  LIMIT = 20

  default_scope {
    order("created_at DESC")
  }

  scope :all_include, -> {
    includes(:game).includes(:log).includes(:user).includes(:post_likes).includes(:post_photos).includes(:post_comments)
  }

  def save_with(files)
    files.each do |file|
      photo_path = self.class.url_upload(file, "post")
      PostPhoto.create!(post_id: self[:id], photo_path: photo_path)
    end
  end

  def facebook(current_user)
    me = FbGraph::User.me(current_user.token)
    me.feed!(
      :message => self[:text],
      #:picture => 'https://graph.facebook.com/matake/picture',
      #:link => 'https://github.com/bussorenre',
      :name => "Gameful",
      :description => "Posted from Gameful"
    )
  end

  def twitter(current_user)
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "o0oeDXJ131ufgroZv1ur7sZ6E"
      config.consumer_secret     = "e3yyRbH2s4eI4AuFrtMMKwxGTi7ZHF00qslNWbYKzClMWgmWJf"
      config.access_token        = current_user[:token]
      config.access_token_secret = current_user[:secret_token]
    end

    client.update(self[:text])
  end

  def datetime
    self[:created_at].strftime("%Y/%m/%d %H:%M:%S")
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
        user_id: log_params[:user_id],
        game_id: log_params[:game_id],
        log_id:  log_id
      }

      case type
      when "create"
        params[:text]  = "#{current_game[:title]}をマイゲームに追加しました"
      when "status_update"
        current_status = Status.find log_params[:status_id]
        params[:text]  = "#{current_game[:title]}のステータスを#{current_status[:name]}に変更しました"
      when "rate_update"
        current_rate   = log_params[:rate]
        params[:text]  = "#{current_game[:title]}の評価を#{current_rate}に変更しました"
      end

      self.create params
    end
  end
end
