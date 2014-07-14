class Api::UsersController < ApplicationController
	def index
		@users = User.search_with(params[:username], @current_user)
	end
end
