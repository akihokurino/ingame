class CreateGameReviews < ActiveRecord::Migration
  def change
    create_table :game_reviews do |t|
      t.text :text
      t.references :user, index: true
      t.references :log, index: true
      t.references :game, index: true
      t.integer :review_likes_count, default: 0
      t.integer :review_comments_count, default: 0

      t.timestamps
    end
  end
end
