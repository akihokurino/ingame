class Api::PostCommentsController < ApplicationController

  def index
    result         = PostComment.get_by_post params[:post_id], params[:type], params[:offset], params[:limit], @current_user[:id]
    @post_comments = result[:post_comments]
    @is_all        = result[:is_all]
  end

  def create
    params[:post_comment][:user_id] = @current_user[:id]
    @comment                        = PostComment.create post_comment_params

    unless @current_user[:id].to_i == params[:post_comment][:to_user_id].to_i
      Notification.create from_user_id: @current_user[:id], to_user_id: params[:post_comment][:to_user_id], notification_type_id: 3, post_id: @comment[:post_id]
    end
  end

  def destroy
    comment = PostComment.find params[:id]
    comment.destroy
    @result = true
  end

  private
  def post_comment_params
    params.require(:post_comment).permit :user_id, :post_id, :text
  end
end
