class Api::UsersController < ApplicationController
	def index

		@users = User.search_with(params[:username])
	end
end
