class CreateReviewComments < ActiveRecord::Migration
  def change
    create_table :review_comments do |t|
      t.references :user, index: true
      t.references :review, index: true
      t.integer :review_comment_likes_count, default: 0
      t.text :text

      t.timestamps
    end
  end
end
