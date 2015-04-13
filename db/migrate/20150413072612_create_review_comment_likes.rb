class CreateReviewCommentLikes < ActiveRecord::Migration
  def change
    create_table :review_comment_likes do |t|
      t.references :review_comment, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
