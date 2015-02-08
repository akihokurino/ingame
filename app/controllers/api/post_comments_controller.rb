class Api::PostCommentsController < ApplicationController
  def create
    params[:post_comment][:user_id] = @current_user[:id]
    p post_comment_params
    @comment                        = PostComment.create post_comment_params

    unless @current_user[:id].to_i == params[:post_comment][:to_user_id].to_i
      Notification.create(from_user_id: @current_user[:id], to_user_id: params[:post_comment][:to_user_id], notification_type_id: 3)
    end
  end

  def destroy
  end

  private
  def post_comment_params
    params.require(:post_comment).permit(:user_id, :post_id, :text)
  end
end
