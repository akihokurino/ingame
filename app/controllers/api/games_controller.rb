class Api::GamesController < ApplicationController
  before_action :set_game, only: [:show]

  def show

  end

	def search
    page = params[:page].to_i
    return false if page < 1
		@results = Game.search(params[:search_title], page, @current_user)
	end

	private
  def set_game
    @game = Game.find(params[:id])
  end
end
