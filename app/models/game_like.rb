class GameLike < ActiveRecord::Base
	belongs_to :game, counter_cache: true
	belongs_to :user

	validates :game_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true

	class << self
		def check_and_create(game_like_params)
			return false if self.exists?(game_like_params)
			self.create(game_like_params) ? true : false
		end

		def check_and_destroy(param_hash)
			return false unless self.exists?(param_hash)
			game_like = self.find_by(param_hash)
			game_like.destroy ? true : false
		end
	end
end
