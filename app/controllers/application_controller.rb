class ApplicationController < ActionController::Base
  	# Prevent CSRF attacks by raising an exception.
  	# For APIs, you may want to use :null_session instead.
  	protect_from_forgery with: :exception
  	before_action :auth

  	private
  	def auth
  		if session[:current_user_id]
  			begin
  				@current_user = User.find(session[:current_user_id])
  			rescue ActiveRecord::RecordNotFound
    			reset_session
    		end
    	end

    	redirect_to login_users_path unless @current_user
  	end
end
