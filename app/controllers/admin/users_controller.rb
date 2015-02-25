class Admin::UsersController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin

  PER = 50

  def index
    @q     = User.page(params[:page]).per(PER).order("created_at DESC").ransack(search_params)
    @users = @q.result
  end

  private
  def search_params
    params.require(:q).permit!
  rescue
  end
end
