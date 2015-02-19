class Notification < ActiveRecord::Base
  belongs_to :notification_type
  belongs_to :to_user, :class_name => "User", :foreign_key => "to_user_id"
  belongs_to :from_user, :class_name => "User", :foreign_key => "from_user_id"

  validates :from_user_id,
    presence: true,
    numericality: true
  validates :to_user_id,
    presence: true,
    numericality: true
  validates :notification_type_id,
    presence: true,
    numericality: true

  scope :all_include, -> {
    includes(:to_user).includes(:from_user).includes(:notification_type)
  }

  class << self
    def my_notifications(current_user)
      notifications = current_user.received_notifications.where("created_at > ?", 1.week.ago).all_include.order("created_at DESC")
      notifications.update_all(is_read: true)
      notifications
    end

    def my_count(current_user)
      current_user.received_notifications.where(is_read: false).where("created_at > ?", 1.week.ago).count
    end
  end
end
