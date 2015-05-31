class ReviewsController < ApplicationController
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]
  before_action :set_game, only: [:new, :show, :edit]
  before_action :set_review, only: [:show, :edit]

  def show
    @review.i_like? @current_user[:id]
  end

  def new
    log = @game.logs.find_by user_id: @current_user[:id]
    if log.review.blank?
      @review = Review.new
      @game.format_datetime
      @game.check_regist @current_user
      @game.check_rate @current_user
    else
      redirect_to edit_game_review_path @game[:id], log.review[:id]
    end
  end

  def edit

  end

  private
  def set_game
    @game = Game.find params[:game_id]
  end

  def set_review
    @review = Review.find params[:id]
  end
end
