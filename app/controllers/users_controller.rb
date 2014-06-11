class UsersController < ApplicationController
	skip_before_action :auth, only: [:login]
	def login
	end

	def logout
		reset_session
    	redirect_to login_users_path
	end
end
