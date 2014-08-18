class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.text :text
      t.integer :post_likes_count, :default => 0
      t.integer :post_comments_count, :default => 0

      t.references :user
      t.references :game
      t.references :log

      t.timestamps
    end
  end
end
