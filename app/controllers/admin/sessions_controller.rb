class Admin::SessionsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin, only: [:destroy]

  def new
  end

  def create
    if admin = Admin.authenticate(params[:username], params[:password], params[:key])
      session[:current_admin_id] = admin[:id]
      redirect_to admin_games_path, notice: "ログインに成功しました。ようこそ管理画面へ。"
    else
      redirect_to new_admin_session_path, alert: "不正なユーザーです。"
    end
  end

  def destroy
  end
end
