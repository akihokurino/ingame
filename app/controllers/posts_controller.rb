class PostsController < ApplicationController
  before_action :set_post, only: [:show]
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]

  def index
    if @current_user[:is_first]
      @current_user.update is_first: false
    end
  end

  def show
    @post.i_like? @current_user[:id] unless @current_user[:id].nil?
  end

  def new
  end

  private
  def set_post
    @post = Post.find params[:id]
  end
end
