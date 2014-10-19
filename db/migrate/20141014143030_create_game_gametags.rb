class CreateGameGametags < ActiveRecord::Migration
  def change
    create_table :game_gametags do |t|
      t.references :game, index: true
      t.references :gametag, index: true

      t.timestamps
    end
  end
end
