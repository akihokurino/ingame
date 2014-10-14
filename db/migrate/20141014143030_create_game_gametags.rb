class CreateGameGametags < ActiveRecord::Migration
  def change
    create_table :game_gametags do |t|
      t.references :game
      t.references :game_tag

      t.timestamps
    end
  end
end
