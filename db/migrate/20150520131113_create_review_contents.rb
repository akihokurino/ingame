class CreateReviewContents < ActiveRecord::Migration
  def change
    create_table :review_contents do |t|
      t.references :review, index: true
      t.references :review_content_type, index: true
      t.text :body
      t.integer :order

      t.timestamps
    end
  end
end
