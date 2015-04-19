class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	# skip_before_action :verify_authenticity_token
	protect_from_forgery with: :exception

	before_action :auth, :set_headers, :set_meta
	helper_method :current_user?

	rescue_from Exception, with: :error500
  rescue_from ActiveRecord::RecordNotFound, ActionController::RoutingError, with: :error404

	include Jpmobile::ViewSelector

	def cors_preflight_check
		head :no_content
	end

  private
  def set_meta
    @head_meta = {
      title:       "Gamr",
      description: "遊んだゲームや気になるゲームを簡単に登録・管理！レビューや感想を共有して、新たなゲーム・新たなゲーマーに出会おう。",
      keywords:    "Gamr（ゲーマー）,ゲームのSNS,ゲームの感想,ゲームのレビュー,ゲームの評価,ゲームのつぶやき",
      og: {
        site_name: "ゲーマーのためのSNS「Gamr(ゲーマー)」",
        type:      "article"
      },
      twitter: {
        card: "summary",
        site: "@Gamr_jp",
      },
      common: {
        url:   "http://gamr.jp",
        image: ""
      }
    }
  end

  def set_headers
		origin_regex = Regexp.new(Settings.cors.origin_regex, Regexp::IGNORECASE)
		if request.headers["HTTP_ORIGIN"] && origin_regex.match(request.headers["HTTP_ORIGIN"])
			headers['Access-Control-Allow-Origin'] = request.headers["HTTP_ORIGIN"]
			Settings.cors[Rails.env.to_s].headers.each { |k, v| headers[k.to_s] = v }
		end
	end

  def current_user?(user)
    (@current_user[:id] == user[:id]) ? true : false
  end

	def auth
    set_session_user
		redirect_to login_users_path unless @current_user
	end

  def open_page
    @current_user = { id: nil }
    set_session_user
  end

  def auth_provider
    set_session_provider
    redirect_to login_users_path unless @current_provider
  end

  def auth_admin
    set_session_admin
    redirect_to admin_games_path unless @current_admin
  end

  def set_session_user
    if session[:current_user_id]
      begin
        @current_user = User.find session[:current_user_id]
        @current_user.check_follow_num
      rescue ActiveRecord::RecordNotFound
        reset_session
      end
    end
  end

  def set_session_provider
    if session[:current_provider_id]
      begin
        @current_provider = UserProvider.find session[:current_provider_id]
      rescue ActiveRecord::RecordNotFound
        reset_session
      end
    end
  end

  def set_session_admin
    if session[:current_admin_id]
      begin
        @current_admin = Admin.find session[:current_admin_id]
      rescue ActiveRecord::RecordNotFound
        reset_session
      end
    end
  end

	def error500(e)
    raise
    #render "error500", status: 500, formats: [:html]
  end

  def error404(e)
    raise
    #render "error404", status: 404, formats: [:html]
  end
end
