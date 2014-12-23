class Admin::SessionsController < ApplicationController
  require 'digest'
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin, only: [:destroy]
  before_action :basic_auth, only: [:new, :create]

  def new
  end

  def create
    if admin = Admin.authenticate(params[:username], params[:password], params[:key])
      session[:current_admin_id] = admin[:id]
      redirect_to admin_games_path
    else
      redirect_to new_admin_session_path, alert: "不正なユーザーです。"
    end
  end

  def destroy
    reset_session
    redirect_to new_admin_session_path, alert: "正常にログアウトしました。"
  end

  private
  def basic_auth
    authenticate_or_request_with_http_basic('Administration') do |username, password|
      md5_of_password = Digest::MD5.hexdigest(password)
      username == 'ingame_admin' && md5_of_password == '5ebe2294ecd0e0f08eab7690d2a6ee69'
      # password == secret
    end
  end
end
