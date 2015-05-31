class ReviewsController < ApplicationController
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]
  before_action :set_game, only: [:new, :show]
  before_action :set_review, only: [:show]

  def show
    @review.i_like? @current_user[:id]
  end

  def new
    @game.format_datetime
    @game.check_regist @current_user
    @game.check_rate @current_user
  end

  private
  def set_game
    @game = Game.find params[:game_id]
  end

  def set_review
    @review = Review.find params[:id]
  end
end
