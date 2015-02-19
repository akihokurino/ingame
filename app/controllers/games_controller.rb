class GamesController < ApplicationController
	before_action :set_game, only: [:show]

	def show
    @game.format_datetime
    @game.check_regist @current_user
    @game.check_rate @current_user
	end

	private
	def set_game
		@game = Game.find params[:id]
	end
end
