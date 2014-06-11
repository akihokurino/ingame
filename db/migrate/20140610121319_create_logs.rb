class CreateLogs < ActiveRecord::Migration
	def change
		create_table :logs, :id => false do |t|
			t.integer :id, :limit => 8
			t.primary_key :id
			t.integer :game_id, :limit => 8
			t.integer :status_id
			t.integer :user_id, :limit => 8
			t.text :text

			t.timestamps
		end
	end
end
