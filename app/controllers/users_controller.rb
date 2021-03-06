class UsersController < ApplicationController
  include CheckOriginal

  skip_before_action :auth, only: [:login, :new]
  before_action :set_user, only: [:show, :edit, :update]
  before_action :auth_provider, only: [:new], :unless => :original?
  before_action :set_session_user, only: [:login]

  def login
    redirect_to posts_path if @current_user
  end

  def setting
  end

  def show
    @user.check_follow @current_user
  end

  def new
  end

  def edit
  end

  def update
    clip = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    if @user.update_with_file(user_params, clip)
      redirect_to "/users/#{@user[:id]}#logs", notice: "ユーザー情報を変更しました"
    else
      render "edit"
    end
  end

  def destroy
    if @current_user.destroy
      reset_session
      redirect_to login_users_path
    end
  end

  def logout
    reset_session
    redirect_to login_users_path
  end

  private
  def user_params
    params.require(:user).permit :username, :introduction, :place, :photo_path, :email, :password
  end

  def set_user
    @user = User.find params[:id]
  end
end
