class CreatePostUrls < ActiveRecord::Migration
  def change
    create_table :post_urls do |t|
      t.integer :post_id
      t.string :title
      t.text :description
      t.string :thumbnail
      t.string :url

      t.timestamps
    end
  end
end
