class Post < ActiveRecord::Base
	belongs_to :user, counter_cache: true
	belongs_to :game

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
			posts = self.where(user_id: follower_ids).includes(:game).includes(:user)
		end
	end
end
