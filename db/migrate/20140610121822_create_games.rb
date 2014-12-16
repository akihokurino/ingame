class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title, :limit => 255, :index => true
      t.string :photo_url
      t.string :photo_path
      t.string :maker, :limit => 255, :index => true
      t.string :amazon_url
      t.text :wiki
      t.string :provider
      t.integer :provider_id
      t.date :release_day
      t.integer :game_likes_count, :default => 0
      t.integer :posts_count, :default => 0

      t.timestamps
    end
  end
end
