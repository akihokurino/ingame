class CreatePosts < ActiveRecord::Migration
  	def change
    	create_table :posts do |t|
      		t.integer :user_id
      		t.integer :game_id
      		t.text :text
      		t.integer :post_likes_count, :default => 0

      		t.timestamps
    	end
  	end
end
