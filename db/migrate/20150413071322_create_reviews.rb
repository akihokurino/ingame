class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.references :user, index: true
      t.references :log, index: true
      t.references :game, index: true
      t.string :title
      t.integer :review_likes_count, default: 0
      t.integer :review_comments_count, default: 0
      t.integer :view_count, default: 0

      t.timestamps
    end
  end
end
