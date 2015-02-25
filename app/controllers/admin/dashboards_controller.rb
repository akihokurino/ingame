class Admin::DashboardsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin

  def index
    @current_game_count = Game.all.count
    @current_log_count  = Log.all.count
    @current_user_count = User.all.count
  end
end
