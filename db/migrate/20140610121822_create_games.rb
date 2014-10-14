class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title, :limit => 255, :index => true
      # deviceごとに異なる画像を見せることができないが、
      # 元からそんなもの取れないので放置する。
      t.string :photo_url   # ネット上のURL
      t.string :photo_path  # 自分でrmagickした画像のパス
      t.string :maker, :limit => 255, :index => true
      t.integer :game_likes_count, :default => 0
      t.integer :posts_count, :default => 0
      t.string :amazon_url  # <- どうやって補充するか未解決

      t.string :provider    # steamとかfamituuとか
      t.string :provider_id # いるかどうか謎だが、一応

      t.timestamps
    end
  end
end
