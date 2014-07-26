class Api::LogsController < ApplicationController
  def index
    @logs = Log.where(user_id: params[:user_id]).order("created_at ASC").includes(:game)
  end

  def create
    if(params[:amazon_url])
      result = Game.get_from_amazon(params[:amazon_url])
      @log = Log.create_with(result, @current_user)
    else
      params[:log][:user_id] = @current_user[:id]
      @log = Log.last if Log.create(log_params)
    end
  end

  def destroy
    log = Log.find(params[:id])
    log.destroy
    render nothing: true
  end

  def update
  end

  def update_status
    p params[:log]
    log = @current_user.logs.find_by(game_id: params[:id])
    @result = log.update(log_params) ? true : false
  end

  private
  def log_params
    params.require(:log).permit(:game_id, :user_id, :status_id)
  end
end
