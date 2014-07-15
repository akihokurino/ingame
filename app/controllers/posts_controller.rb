class PostsController < ApplicationController
  def index
    if @current_user[:is_first]
      @current_user.update(is_first: false)
    end
  end

  def new
  end
end
