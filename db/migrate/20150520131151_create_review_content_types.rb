class CreateReviewContentTypes < ActiveRecord::Migration
  def change
    create_table :review_content_types do |t|
      t.string :name

      t.timestamps
    end
  end
end
