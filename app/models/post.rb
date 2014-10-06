class Post < ActiveRecord::Base
  include RandomName
  include CostomUpload

  belongs_to :user, counter_cache: true
  belongs_to :game, counter_cache: true
  belongs_to :log
  has_many   :post_likes
  has_many   :post_photos
  has_many   :post_comments

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
    end

    def get_user_posts(current_user_id, user_id, page)
      offset = (page - 1) * LIMIT
      posts  = self.where(user_id: user_id).all_include.offset(offset).limit(LIMIT)
      posts  = self.i_like?(posts, current_user_id)
    end

    def get_all_posts_of_game(current_user_id, game_id)
      posts = self.where(game_id: game_id).all_include
      posts = self.i_like?(posts, current_user_id)
    end

    def get_follower_posts_of_game(current_user_id, game_id)
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      posts        = self.where(game_id: game_id, user_id: follower_ids).all_include
      posts        = self.i_like?(posts, current_user_id)
    end

    def get_liker_posts_of_game(current_user_id, game_id)
      posts = self.where(game_id: game_id).all_include.order("post_likes_count DESC")
      posts = self.i_like?(posts, current_user_id)
    end

    def i_like?(post_args, current_user_id)
      post_args.map do |post|
        post.i_liked = post.post_likes.pluck(:user_id).include?(current_user_id) ? true : false
        post
      end
    end
  end
end
