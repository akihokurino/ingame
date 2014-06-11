class CreatePostLikes < ActiveRecord::Migration
  	def change
    	create_table :post_likes, :id => false do |t|
    		t.integer :id, :limit => 8
    		t.primary_key :id
      		t.integer :post_id, :limit => 8
      		t.integer :user_id, :limit => 8

      		t.timestamps
    	end
  	end
end
