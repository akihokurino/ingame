class Log < ActiveRecord::Base
	belongs_to :game
	belongs_to :status
	belongs_to :user, counter_cache: true

	validates :game_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true

	class << self
		def create_with(result, current_user)
			game = Game.find_or_create_by! result
			log  = self.create({game_id: game[:id], user_id: current_user[:id], status_id: 1})
		end
	end
end
