class Api::UserLogOrdersController < ApplicationController
  def show
    @already_customised, @log_order = UserLogOrder.get_order params[:id]
  end

  def create

  end

  def update
  end

  private
  def user_log_order_params
    params.require(:user_log_order).permit :user_id, :status_id, :order
  end
end
