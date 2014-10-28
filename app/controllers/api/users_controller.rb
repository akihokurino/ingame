class Api::UsersController < ApplicationController
  before_action :set_user, only: [:update]

  def index
    type = params[:type]
    page = params[:page].to_i
    return if page < 1

    case type
    when "follows"
      @users = User.get_follows(@current_user, params[:user_id], page)
    when "followers"
      @users = User.get_followers(@current_user, params[:user_id], page)
    end
  end

  def update
    clip = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    @result = @user.update_with_url(user_params, clip)
  end

  def search
    page   = params[:page].to_i
    return false if page < 1
    @users = User.search_with(params[:username], @current_user, page)
  end

  private
  def user_params
    params.require(:user).permit(:username, :introduction, :place, :photo_path, :place)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
