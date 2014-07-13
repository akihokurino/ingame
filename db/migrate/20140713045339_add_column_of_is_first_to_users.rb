class AddColumnOfIsFirstToUsers < ActiveRecord::Migration
  def change
    add_column :users, :is_first, :boolean
  end
end
