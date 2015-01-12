class CreateGameUrls < ActiveRecord::Migration
  def change
    create_table :game_urls do |t|
      t.references :game, index: true
      t.text :text

      t.timestamps
    end
  end
end
