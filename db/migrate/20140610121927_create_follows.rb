class CreateFollows < ActiveRecord::Migration
  	def change
    	create_table :follows, :id => false do |t|
    		t.integer :id, :limit => 8
      		t.integer :from_user_id, :limit => 8
      		t.integer :to_user_id, :limit => 8

      		t.timestamps
    	end
  	end
end
