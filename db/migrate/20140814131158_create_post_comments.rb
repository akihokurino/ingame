class CreatePostComments < ActiveRecord::Migration
  def change
    create_table :post_comments do |t|
      t.references :user, index: true
      t.references :post, index: true
      t.integer :comment_likes_count, :default => 0
      t.text :text

      t.timestamps
    end
  end
end
