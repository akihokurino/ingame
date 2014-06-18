class CreateGameLikes < ActiveRecord::Migration
  def change
    create_table :game_likes do |t|

      t.references :game
      t.references :user

      t.timestamps
    end
  end
end
