class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	# skip_before_action :verify_authenticity_token
	protect_from_forgery with: :exception

	before_action :auth, :set_headers
	helper_method :current_user?

	rescue_from Exception, with: :error500
  rescue_from ActiveRecord::RecordNotFound, ActionController::RoutingError, with: :error404

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
				@current_user.check_follow_num
			rescue ActiveRecord::RecordNotFound
				reset_session
			end
		end

		redirect_to login_users_path unless @current_user
	end

	def auth_provider
    if session[:current_provider_id]
    	begin
				@current_provider = UserProvider.find(session[:current_provider_id])
			rescue ActiveRecord::RecordNotFound
				reset_session
			end
    end

    redirect_to login_users_path unless @current_provider
  end

	def current_user?(user)
		(@current_user[:id] == user[:id]) ? true : false
	end

	def auth_admin
		if session[:current_admin_id]
			begin
				@current_admin = Admin.find(session[:current_admin_id])
			rescue ActiveRecord::RecordNotFound
				reset_session
			end
		end

		redirect_to admin_games_path unless @current_admin
	end

	def error500(e)
    logger.error [e, *e.backtrace].join("¥n")
    render "error500", status: 500, formats: [:html]
  end

  def error404(e)
    render "error404", status: 404, formats: [:html]
  end
end
