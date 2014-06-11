class CreatePostPhotos < ActiveRecord::Migration
  	def change
    	create_table :post_photos, :id => false do |t|
    		t.integer :id, :limit => 8
    		t.primary_key :id
      		t.integer :post_id, :limit => 8
      		t.string :photo_path

      		t.timestamps
    	end
  	end
end
