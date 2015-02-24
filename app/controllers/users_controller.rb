class UsersController < ApplicationController
  skip_before_action :auth, only: [:login, :term, :privacy, :new]
  before_action :set_user, only: [:show, :edit, :update]
  before_action :auth_provider, only: [:new]

  def login
    # reset_session
    if session[:current_user_id]
      @current_user = User.find session[:current_user_id]
      redirect_to posts_path if @current_user
    end
  end

  def setting
  end

  def search_game_or_user
  end

  def show
    @user.check_follow(@current_user)
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
      redirect_to login_users_path
    end
  end

  def logout
    reset_session
    redirect_to login_users_path
  end

  def term
  end

  def privacy
  end

  private
  def user_params
    params.require(:user).permit(:username, :introduction, :place, :photo_path, :email, :password)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
