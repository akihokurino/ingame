class Log < ActiveRecord::Base
	belongs_to :game
	belongs_to :status
	belongs_to :user, counter_cache: true

	validates :game_id,
		presence: true,
		numericality: true
	validates :status_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true

	class << self
		def create_with(result, params, current_user)
			begin
				ActiveRecord::Base.transaction do
					game = Game.find_or_create!(result)
					self.create!({
						game_id: game[:id],
						status_id: params[:status_id],
						user_id: current_user[:id],
						text: params[:text]
					})
					log = Log.last
				end
			rescue
				raise
			end
		end
	end
end
