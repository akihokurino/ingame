class Api::PostsController < ApplicationController
  include ErrorMessage

  skip_before_action :auth, only: [:index]
  before_action :open_page, only: [:index]

  def index
    @posts = Post.custom_query @current_user, params
  end

  def create
    params[:post][:user_id] = @current_user[:id]

    begin
      @last_post = PostTimelineService.new(params, @current_user).exec!
    rescue => e
      @error = set_error_message e
    end
  end

  def destroy
    @result = Post.destroy(params[:id]) ? true : false
  end
end
