class CreatePostYoutubes < ActiveRecord::Migration
  def change
    create_table :post_youtubes do |t|
      t.integer :post_id
      t.string :key

      t.timestamps
    end
  end
end
