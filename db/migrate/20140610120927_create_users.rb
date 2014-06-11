class CreateUsers < ActiveRecord::Migration
	def change
		create_table :users, :id => false do |t|
			t.integer :id, :limit => 8, :auto_increment => true, :primary => true
			t.primary_key :id
			t.string :username, :limit => 100
			t.string :introduction, :limit => 255
			t.integer :logs_count, :limit => 8, :default => 0
			t.integer :posts_count, :limit => 8, :default => 0
			t.string :photo_path
			t.string :place, :limit => 255

			t.timestamps
		end
	end
end
