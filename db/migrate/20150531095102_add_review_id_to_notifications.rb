class AddReviewIdToNotifications < ActiveRecord::Migration
  def change
    add_reference :notifications, :review, index: true
  end
end
