class CreateGameDevices < ActiveRecord::Migration
  def change
    create_table :game_devices do |t|
      t.references :game
      t.references :device

      t.timestamps
    end
  end
end
