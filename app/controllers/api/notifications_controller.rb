class Api::NotificationsController < ApplicationController
  def index
    page           = params[:page].to_i
    return if page < 1
    @notifications = Notification.my_notifications(@current_user, page)
  end

  def count
    @count = Notification.my_count(@current_user)
  end
end
