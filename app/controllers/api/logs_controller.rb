class Api::LogsController < ApplicationController

  def index
    @logs = Log.where(user_id: params[:user_id]).order("created_at ASC").includes(:game)
  end

  def create
    params[:log][:user_id] = @current_user[:id]
    @log                   = Log.create log_params
    @log.twitter @current_user
    Post.create_activity log_params, @log[:id], "create"
  end

  def update
  end

  def destroy
    log     = @current_user.logs.find_by game_id: params[:id]
    @result = log.destroy ? true : false
  end

  def update_status_or_rate
    log                    = @current_user.logs.find_by game_id: params[:id]
    @result                = log.update(log_params) ? true : false

    params[:log][:user_id] = @current_user[:id]
    params[:log][:game_id] = params[:id]

    log.twitter @current_user

    if log_params[:status_id]
      Post.create_activity log_params, log[:id], "status_update"
    elsif log_params[:rate]
      Post.create_activity log_params, log[:id], "rate_update"
    end
  end

  private
  def log_params
    params.require(:log).permit :game_id, :user_id, :status_id, :rate
  end
end
