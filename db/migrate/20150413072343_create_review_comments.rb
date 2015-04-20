class CreateReviewComments < ActiveRecord::Migration
  def change
    create_table :review_comments do |t|
      t.references :user, index: true
      t.references :review, index: true
      t.string :review_comment_likes_count
      t.text :text

      t.timestamps
    end
  end
end
