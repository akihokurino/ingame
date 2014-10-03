class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	# skip_before_action :verify_authenticity_token
	protect_from_forgery with: :exception

	before_action :auth, :set_headers
	helper_method :current_user?

	include Jpmobile::ViewSelector

	def cors_preflight_check
		head :no_content
	end

  private
  def set_headers
		origin_regex = Regexp.new(Settings.cors.origin_regex, Regexp::IGNORECASE)
		if request.headers["HTTP_ORIGIN"] && origin_regex.match(request.headers["HTTP_ORIGIN"])
			headers['Access-Control-Allow-Origin'] = request.headers["HTTP_ORIGIN"]
			Settings.cors[Rails.env.to_s].headers.each { |k, v| headers[k.to_s] = v }
		end
	end

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

	def current_user?(user)
		(@current_user[:id] == user[:id]) ? true : false
	end
end
