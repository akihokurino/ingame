class CreateGameLikes < ActiveRecord::Migration
  def change
    create_table :game_likes do |t|
      t.integer :game_id
      t.integer :user_id

      t.timestamps
    end
  end
end
