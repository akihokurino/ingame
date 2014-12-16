class CreateGameDevices < ActiveRecord::Migration
  def change
    create_table :game_devices do |t|
      t.references :game, index: true
      t.references :device, index: true

      t.timestamps
    end
  end
end
