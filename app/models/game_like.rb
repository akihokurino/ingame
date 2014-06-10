class GameLike < ActiveRecord::Base
	belongs_to :game, counter_cache: true
	belongs_to :user

	validates :game_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true
end
