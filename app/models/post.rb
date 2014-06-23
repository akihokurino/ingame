class Post < ActiveRecord::Base
	belongs_to :user, counter_cache: true
	belongs_to :game
	has_many :post_likes

	attr_accessor :i_liked

	validates :user_id,
		presence: true,
		numericality: true
	validates :game_id,
		presence: true,
		numericality: true
	validates :text,
		presence: true

	class << self
		def get_all_posts(current_user_id)
			follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
			follower_ids << current_user_id
			posts = self.where(user_id: follower_ids).includes(:game).includes(:user).includes(:post_likes)
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
