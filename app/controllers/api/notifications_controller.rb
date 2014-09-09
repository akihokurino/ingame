class Api::NotificationsController < ApplicationController
  def index
    @notifications = Notification.my_notifications(@current_user)
  end

  def count
    @count = Notification.my_count(@current_user)
  end
end
