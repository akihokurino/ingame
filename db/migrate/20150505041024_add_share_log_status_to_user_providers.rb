class AddShareLogStatusToUserProviders < ActiveRecord::Migration
  def change
    add_column :user_providers, :share_log_status, :boolean, default: false
  end
end
