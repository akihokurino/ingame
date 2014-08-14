class Api::PostCommentsController < ApplicationController
  def create
    params[:post_comment][:user_id] = @current_user[:id]
    @comment = PostComment.create post_comment_params
  end

  def destroy
  end

  private
  def post_comment_params
    params.require(:post_comment).permit(:user_id, :post_id, :text)
  end
end
