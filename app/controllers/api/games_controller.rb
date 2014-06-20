class Api::GamesController < ApplicationController
	def index
		@games = Log.where(user_id: @current_user[:id]).select(:game_id).map do |log|
			log.game.select(:id, :title)
		end
	end
end
