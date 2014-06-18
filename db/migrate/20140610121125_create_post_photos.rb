class CreatePostPhotos < ActiveRecord::Migration
  def change
    create_table :post_photos do |t|
      t.integer :post_id
      t.string :photo_path

      t.timestamps
    end
  end
end
