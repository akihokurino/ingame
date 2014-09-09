class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.integer :from_user_id
      t.integer :to_user_id
      t.references :notification_type
      t.boolean :is_read, default: false

      t.timestamps
    end
  end
end
