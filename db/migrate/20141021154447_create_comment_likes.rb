class CreateCommentLikes < ActiveRecord::Migration
  def change
    create_table :comment_likes do |t|
      t.references :post_comment
      t.references :user

      t.timestamps
    end
  end
end
