class Post < ActiveRecord::Base
  belongs_to :user, counter_cache: true
  belongs_to :game, counter_cache: true
  has_many :post_likes

  validates :user_id,
    presence: true,
    numericality: true
  validates :game_id,
    presence: true,
    numericality: true
  validates :text,
    presence: true

  attr_accessor :i_liked

  class << self
    def get_all_posts(current_user_id)
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      follower_ids << current_user_id
      posts = self.where(user_id: follower_ids).includes(:game).includes(:user).includes(:post_likes)
      posts = self.i_like?(posts, current_user_id)
    end

    def get_all_posts_of_game(current_user_id, game_id)
      posts = self.where(game_id: game_id).includes(:game).includes(:user).includes(:post_likes)
      posts = self.i_like?(posts, current_user_id)
    end

    def get_follower_posts_of_game(current_user_id, game_id)
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      posts = self.where(game_id: game_id, user_id: follower_ids).includes(:game).includes(:user).includes(:post_likes)
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
