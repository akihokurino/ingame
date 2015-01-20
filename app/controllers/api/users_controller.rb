class Api::UsersController < ApplicationController
  skip_before_action :auth, only: [:create, :uniqueness]
  before_action :set_user, only: [:update]
  before_action :auth_provider, only: [:create]

  def index
    type = params[:type]
    page = params[:page].to_i
    return if page < 1

    case type
    when "follows"
      @users = User.get_follows(@current_user, params[:user_id], page)
    when "followers"
      @users = User.get_followers(@current_user, params[:user_id], page)
    when "activity"
      @users = User.get_activity(@current_user)
    end
  end

  def create
    current_user = User.create_with_provider(user_params, @current_provider)
    if current_user
      session[:current_user_id]     = current_user[:id]
      session[:current_provider_id] = nil
      @result = current_user[:id]
    else
      @result = false
    end
  end

  def update
    clip    = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    @result = @user.update_with_url(user_params, clip)
  end

  def uniqueness
    if params[:username]
      @result = User.find_by(username: params[:username]) ? false : true
    end
  end

  def search
    page    = params[:page].to_i
    return false if page < 1
    @result = User.search_with(params[:username], @current_user, page)
  end

  def tmp_upload
    clip    = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    @result = User.tmp_upload(params[:user][:tmp_data], clip)
  end

  private
  def user_params
    params.require(:user).permit(:username, :introduction, :place, :photo_path, :email, :password)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
