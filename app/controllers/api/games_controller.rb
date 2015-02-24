class Api::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token, :auth, only: [:create]
  before_action :set_game, only: [:show]

  def index

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

  def create
    @result = Game.get_from_amazon params[:url]
  end

  def get_ranking
    @results = Game.get_ranking
  end

	private
  def set_game
    @game = Game.find params[:id]
  end
end
