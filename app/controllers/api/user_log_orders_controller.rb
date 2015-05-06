class Api::UserLogOrdersController < ApplicationController
  def show
    @log_order = UserLogOrder.getOrder params[:id]
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
