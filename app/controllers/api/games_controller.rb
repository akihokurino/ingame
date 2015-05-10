class Api::GamesController < ApplicationController
  skip_before_action :auth, only: [:search, :index]
  before_action :set_game, only: [:show]
  before_action :open_page, only: [:search, :index]

  def index
    @games = Game.custom_query @current_user, params
  end

  def show
    @game.check_regist @current_user
    @game.check_rate @current_user
  end

	def search
		@result = Game.search_with @current_user, params
	end

  def devices
    @devices = Game.get_all_devices
  end

	private
  def set_game
    @game = Game.find params[:id]
  end
end
