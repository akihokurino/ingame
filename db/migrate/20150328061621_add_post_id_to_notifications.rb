class AddPostIdToNotifications < ActiveRecord::Migration
  def change
    add_reference :notifications, :post, index: true
  end
end
