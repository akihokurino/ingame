class Api::PostCommentsController < ApplicationController
  skip_before_action :auth, only: [:index]
  before_action :open_page, only: [:index]

  def index
    @post_comments, @is_all = PostComment.get_by_post(params, @current_user[:id]).values_at :post_comments, :is_all
  end

  def create
    params[:post_comment][:user_id]    = @current_user[:id]
    @comment                           = PostComment.create post_comment_params
    params[:post_comment][:to_user_id] = Post.find(params[:post_comment][:post_id]).user_id if params[:post_comment][:to_user_id].blank?

    unless @current_user[:id].to_i == params[:post_comment][:to_user_id].to_i
      Notification.create from_user_id: @current_user[:id], to_user_id: params[:post_comment][:to_user_id], notification_type_id: 3, post_id: @comment[:post_id]
    end
  end

  def destroy
    @result = PostComment.destroy(params[:id]) ? true : false
  end

  private
  def post_comment_params
    params.require(:post_comment).permit :user_id, :post_id, :text
  end
end
