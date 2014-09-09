class Api::FollowsController < ApplicationController
  def create
    params[:follow][:from_user_id] = @current_user[:id]
    @result                        = Follow.create_unless_exists?(follow_params)

    Notification.create(from_user_id: @current_user[:id], to_user_id: params[:follow][:to_user_id], notification_type_id: 1)
  end

  def destroy
    @result = Follow.destroy_if_exists?(@current_user, params[:id])
  end

  private
  def follow_params
    params.require(:follow).permit(:from_user_id, :to_user_id)
  end
end
