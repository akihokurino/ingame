class Api::GamesController < ApplicationController
	def index
		@games = Log.where(user_id: @current_user[:id]).select(:game_id).map do |log|
			log.game
		end
	end

	def search
		@results = Game.where("title LIKE ?", "%#{escape_like(params[:search_title])}%").keep_if do |game|
			!@current_user.logs.pluck(:game_id).include?(game.id)
		end
	end

	private
	def escape_like(string)
	  	string.gsub(/[\\%_]/){|m| "\\#{m}"}
	end
end
