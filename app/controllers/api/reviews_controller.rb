class Api::ReviewsController < ApplicationController
  def create
    review_registerer = ReviewRegisterer.new review_params, @current_user[:id]
    @result           = review_registerer.save
  end

  private
  def review_params
    params.require(:review).permit :game_id, :rate, :title, :contents => [:type, :value]
  end
end
