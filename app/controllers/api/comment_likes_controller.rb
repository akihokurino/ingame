class Api::CommentLikesController < ApplicationController
  def create
    params[:comment_like][:user_id] = @current_user[:id]
    @result                         = CommentLike.check_and_create comment_like_params
    comment                         = PostComment.find params[:comment_like][:post_comment_id]
    unless @current_user[:id].to_i == params[:comment_like][:to_user_id].to_i
      Notification.create from_user_id: @current_user[:id], to_user_id: params[:comment_like][:to_user_id], notification_type_id: 4, post_id: comment[:post_id]
    end
  end

  def destroy
    @result = CommentLike.check_and_destroy user_id: @current_user[:id], post_comment_id: params[:id]
  end

  private
  def comment_like_params
    params.require(:comment_like).permit :post_comment_id, :user_id
  end
end
