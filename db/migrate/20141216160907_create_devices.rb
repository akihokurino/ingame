class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :name, unique: true, limit: 255

      t.timestamps
    end
  end
end
