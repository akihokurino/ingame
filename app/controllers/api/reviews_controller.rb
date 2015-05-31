class Api::ReviewsController < ApplicationController
  def index
    @reviews = Review.custom_query @current_user, params
  end

  def create
    review_registerer = ReviewRegisterer.new review_params, @current_user[:id]
    @result           = review_registerer.save
  end

  private
  def review_params
    params.require(:review).permit :game_id, :rate, :title, :contents => [:type, :value]
  end
end
