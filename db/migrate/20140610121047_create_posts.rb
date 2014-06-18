class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.text :text
      t.integer :post_likes_count, :default => 0

      t.references :user
      t.references :game

      t.timestamps
    end
  end
end
