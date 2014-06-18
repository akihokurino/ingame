class CreateGames < ActiveRecord::Migration
	def change
		create_table :games do |t|
			t.string :title, :limit => 255
			t.string :photo_path
			t.string :device, :limit => 255
			t.string :price
			t.string :maker, :limit => 255
			t.string :release_day
			t.integer :game_likes_count, :default => 0

			t.timestamps
		end
	end
end
