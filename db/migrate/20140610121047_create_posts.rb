class CreatePosts < ActiveRecord::Migration
  	def change
    	create_table :posts, :id => false do |t|
      		t.integer :id, :limit => 8
      		t.integer :user_id, :limit => 8
      		t.integer :game_id, :limit => 8
      		t.text :text
      		t.integer :post_likes_count, :default => 0

      		t.timestamps
    	end
  	end
end
