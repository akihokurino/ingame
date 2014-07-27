class AddColumnPostsNumToGame < ActiveRecord::Migration
  def change
    add_column :games, :posts_count, :integer, :default => 0
  end
end
