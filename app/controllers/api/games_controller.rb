class Api::GamesController < ApplicationController
  skip_before_action :auth, only: [:search, :index]
  before_action :set_game, only: [:show]
  before_action :open_page, only: [:search, :index]

  def index
    if params[:type] == "activity"
      @games = Game.get_ranking @current_user
    end
  end

  def show
    @game.check_regist @current_user
    @game.check_rate @current_user
  end

	def search
    page = params[:page].to_i
    return false if page < 1

		@result = Game.search_with params[:search_title], page, @current_user
	end

	private
  def set_game
    @game = Game.find params[:id]
  end
end
