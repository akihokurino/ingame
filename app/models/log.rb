class Log < ActiveRecord::Base
	belongs_to :game
	belongs_to :status
	belongs_to :user, counter_cache: true

	validates :game_id,
		presense: true,
		numericality: true
	validates :status_id,
		presense: true,
		numericality: true
	validates :user_id,
		presense: true,
		numericality: true
end
