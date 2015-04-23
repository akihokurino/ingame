class Api::UsersController < ApplicationController
  skip_before_action :auth, only: [:create, :uniqueness, :search]
  before_action :set_user, only: [:update]
  before_action :auth_provider, only: [:create], :unless => :original?
  before_action :open_page, only: [:search]

  def index
    @users = User.custom_query @current_user, params
  end

  def create
    current_user = User.create_with_provider user_params, @current_provider
    if current_user
      session[:current_user_id]     = current_user[:id]
      session[:current_provider_id] = nil

      @result = current_user[:id]
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
    @result = User.find_by(username: params[:username]) ? false : true if params[:username]
  end

  def search
    @result = User.search_with @current_user, params
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

  def original?
    !params[:is_original].blank? && params[:is_original] == "true"
  end
end
