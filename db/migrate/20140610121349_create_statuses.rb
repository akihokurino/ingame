class CreateStatuses < ActiveRecord::Migration
  	def change
    	create_table :statuses, :id => false do |t|
    		t.integer :id, :limit => 8
    		t.primary_key :id
      		t.string :name, :limit => 50

      		t.timestamps
    	end
  	end
end
