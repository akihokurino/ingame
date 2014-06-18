class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
      t.string :name, :limit => 50

      t.timestamps
    end
  end
end
