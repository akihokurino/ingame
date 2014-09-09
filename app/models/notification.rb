class Notification < ActiveRecord::Base
  belongs_to :notification_type
  belongs_to :to_user, :class_name => "User", :foreign_key => "to_user_id"
  belongs_to :from_user, :class_name => "User", :foreign_key => "from_user_id"

  scope :all_include, -> {
    includes(:to_user).includes(:from_user).includes(:notification_type)
  }

  class << self
    def my_notifications(current_user)
      notifications = self.where(to_user_id: current_user[:id]).all_include.order("created_at DESC")
      notifications.update_all(is_read: true)
      notifications
    end

    def my_count(current_user)
      self.where(to_user_id: current_user[:id], is_read: false).count
    end
  end
end
