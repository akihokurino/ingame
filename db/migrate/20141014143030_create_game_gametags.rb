class CreateGameGametags < ActiveRecord::Migration
  def change
    create_table :game_gametags do |t|
      t.references :game, index: true
      t.references :game_tag, index: true

      t.timestamps
    end
  end
end
