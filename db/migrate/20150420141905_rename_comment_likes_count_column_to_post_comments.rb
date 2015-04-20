class RenameCommentLikesCountColumnToPostComments < ActiveRecord::Migration
  def change
    rename_column :post_comments, :comment_likes_count, :post_comment_likes_count
  end
end
