class RenameCommentLikesToPostCommentLikes < ActiveRecord::Migration
  def change
    rename_table :comment_likes, :post_comment_likes
  end
end
