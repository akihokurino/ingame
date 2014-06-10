class GameLike < ActiveRecord::Base
	belongs_to :game, counter_cache: true
	belongs_to :user

	validates :game_id,
		presense: true,
		numericality: true
	validates :user_id,
		presense: true,
		numericality: true
end
