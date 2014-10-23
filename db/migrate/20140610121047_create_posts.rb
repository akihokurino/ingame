class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.text :text

      t.references :user
      t.references :log

      t.references :game # cache

      t.integer :post_likes_count, :default => 0
      t.integer :post_comments_count, :default => 0

      t.timestamps
    end
  end
end
