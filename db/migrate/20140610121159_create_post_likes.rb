class CreatePostLikes < ActiveRecord::Migration
  def change
    create_table :post_likes do |t|

      t.references :post
      t.references :user

      t.timestamps
    end
  end
end
