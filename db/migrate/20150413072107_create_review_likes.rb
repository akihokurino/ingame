class CreateReviewLikes < ActiveRecord::Migration
  def change
    create_table :review_likes do |t|
      t.references :game_review, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
