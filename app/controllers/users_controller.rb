class UsersController < ApplicationController
  skip_before_action :auth, only: [:login, :term, :privacy]
  before_action :set_user, only: [:show, :edit, :update]

  def login
  end

  def setting
  end

  def search_game_or_user
  end

  def show
    @user.check_follow(@current_user)
  end

  def edit
  end

  def update
    clip = {x: params[:user][:clip_x].to_i, y: params[:user][:clip_y].to_i}
    if @user.update_with(user_params, clip)
      redirect_to posts_path, notice: "ユーザー情報を変更しました"
    else
      render "edit"
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
    params.require(:user).permit(:username, :introduction, :place, :photo_path, :place)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
