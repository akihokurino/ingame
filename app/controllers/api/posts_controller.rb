class Api::PostsController < ApplicationController
  skip_before_action :auth, only: [:index]
  before_action :open_page, only: [:index]

  def index
    @posts = Post.custom_query @current_user, params
  end

  def create
    params[:post][:user_id] = @current_user[:id]
    @last_post, @error      = PostTimelineService.new(params, @current_user).exec
  end

  def destroy
    @result = Post.destroy(params[:id]) ? true : false
  end
end
