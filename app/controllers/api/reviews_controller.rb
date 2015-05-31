class Api::ReviewsController < ApplicationController
  before_action :set_review, only: [:destroy]

  def index
    @reviews = Review.custom_query @current_user, params
  end

  def create
    review_registerer = ReviewRegisterer.new review_params, @current_user[:id]
    @result           = review_registerer.save
  end

  def destroy
    @result = @review.destroy ? true : false
  end

  private
  def review_params
    params.require(:review).permit :game_id, :rate, :title, :contents => [:type, :value]
  end

  def set_review
    @review = Review.find params[:id]
  end
end
