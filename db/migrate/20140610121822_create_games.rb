class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title, :limit => 255, :index => true
      t.string :photo_url   # ネット上のURL
      t.string :photo_path  # 自分でrmagickした画像のパス
      t.string :maker, :limit => 255, :index => true
      t.string :amazon_url  # <- どうやって補充するか未解決
      t.text :wiki

      t.string :device, :index => true

      t.string :provider    # steamとかfamituuとか
      t.integer :provider_id # いるかどうか謎だが、一応
                            # steam/famituu上でのID。URLから取得。
      t.date :release_day

      t.integer :game_likes_count, :default => 0
      t.integer :posts_count, :default => 0

      t.timestamps
    end
  end
end
