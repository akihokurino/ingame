class Api::UsersController < ApplicationController
  skip_before_action :auth, only: [:create, :uniqueness, :search]
  before_action :set_user, only: [:update]
  before_action :auth_provider, only: [:create]
  before_action :open_page, only: [:search]

  def index
    type = params[:type]
    page = params[:page].to_i
    return if page < 1

    case type
    when "follows"
      @users = User.get_follows @current_user, params[:user_id], page
    when "followers"
      @users = User.get_followers @current_user, params[:user_id], page
    when "activity"
      @users = User.get_activity @current_user
    when "liked"
      @users = User.get_liked @current_user, params[:post_id]
    end
  end

  def create
    current_user = User.create_with_provider user_params, @current_provider
    if current_user
      session[:current_user_id]     = current_user[:id]
      session[:current_provider_id] = nil
      @result                       = current_user[:id]
    else
      @result = false
    end
  end

  def update
    clip = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    begin
      @result = @user.update_with_url user_params, clip
    rescue => e
      case e.message
      when "wrong extname or too big"
        @error = {type: "photo", message: "画像の拡張子が正しくないか、画像のサイズが大き過ぎます。"}
      else
        @error = {type: "something", message: "不正なデータです。"}
      end
    end
  end

  def uniqueness
    if params[:username]
      @result = User.find_by(username: params[:username]) ? false : true
    end
  end

  def search
    page    = params[:page].to_i
    return false if page < 1
    @result = User.search_with params[:username], @current_user, page
  end

  def tmp_upload
    clip = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    begin
      @result = User.tmp_upload params[:user][:tmp_data], clip
    rescue => e
      case e.message
      when "wrong extname or too big"
        @error = {type: "photo", message: "画像の拡張子が正しくないか、画像のサイズが大き過ぎます。"}
      else
        @error = {type: "something", message: "不正なデータです。"}
      end
    end
  end

  private
  def user_params
    params.require(:user).permit :username, :introduction, :place, :photo_path, :email, :password
  end

  def set_user
    @user = User.find params[:id]
  end
end
