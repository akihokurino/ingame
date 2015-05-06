class Api::UserLogOrdersController < ApplicationController
  def show
    @already_customised, @log_order = UserLogOrder.get_order params[:id]
  end

  def create
    @already_customised = UserLogOrder.save_order user_log_order_params, @current_user
  end

  def update
    @already_customised = UserLogOrder.update_order user_log_order_params, @current_user
  end

  private
  def user_log_order_params
    params.require(:user_log_order).permit :order
  end
end
