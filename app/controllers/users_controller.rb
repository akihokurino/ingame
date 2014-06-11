class UsersController < ApplicationController
	skip_before_action :auth, only: [:login]
	before_action :set_user, only: [:edit, :update]

	def login
	end

	def edit
	end

	def update
		if @user.update_with(user_params)
			redirect_to posts_path, notice: "ユーザー情報を変更しました"
		else
			render "edit"
		end
	end

	def logout
		reset_session
    	redirect_to login_users_path
	end

	private
	def user_params
		params.require(:user).permit(:username, :introduction, :place, :photo_path, :place)
	end

	def set_user
		@user = User.find(params[:id])
	end
end
