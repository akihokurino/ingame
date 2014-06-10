class CreateGameLikes < ActiveRecord::Migration
  def change
    	create_table :game_likes, :id => false do |t|
    		t.integer :id, :limit => 8
      		t.integer :game_id, :limit => 8
      		t.integer :user_id, :limit => 8

      		t.timestamps
    	end
  	end
end
