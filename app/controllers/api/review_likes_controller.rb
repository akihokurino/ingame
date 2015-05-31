class Api::ReviewLikesController < ApplicationController
  def create
    params[:review_like][:user_id]    = @current_user[:id]
    @result                           = ReviewLike.check_and_create review_like_params
    params[:review_like][:to_user_id] = Review.find(params[:review_like][:review_id]).user_id if params[:review_like][:to_user_id].blank?

    unless @current_user[:id].to_i == params[:review_like][:to_user_id].to_i
      Notification.create from_user_id: @current_user[:id], to_user_id: params[:review_like][:to_user_id], notification_type_id: 5, review_id: params[:review_like][:review_id]
    end
  end

  def destroy
    param_hash = {user_id: @current_user[:id], review_id: params[:id]}
    @result    = ReviewLike.check_and_destroy param_hash
  end

  private
  def review_like_params
    params.require(:review_like).permit :review_id, :user_id
  end
end
