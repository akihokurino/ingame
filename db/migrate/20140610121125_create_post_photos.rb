class CreatePostPhotos < ActiveRecord::Migration
  def change
    create_table :post_photos do |t|
      t.string :photo_path

      t.references :post

      t.timestamps
    end
  end
end
