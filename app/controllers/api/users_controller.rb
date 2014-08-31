class Api::UsersController < ApplicationController
  before_action :set_user, only: [:update]

	def index
    page   = params[:page].to_i
    return false if page < 1
		@users = User.search_with(params[:username], @current_user, page)
	end

  def update
    @result = @user.update_with_url(user_params)
  end

  private
  def user_params
    params.require(:user).permit(:username, :introduction, :place, :photo_path, :place)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
