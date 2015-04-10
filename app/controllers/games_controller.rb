class GamesController < ApplicationController
	before_action :set_game, only: [:show]
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]

	def show
    @game.format_datetime

    unless @current_user[:id].nil?
      @game.check_regist @current_user
      @game.check_rate @current_user
    end
	end

	private
	def set_game
		@game = Game.find params[:id]
	end
end
