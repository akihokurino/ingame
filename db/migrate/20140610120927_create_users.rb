class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username, :limit => 100
      t.string :password
      t.string :salt
      t.string :introduction, :limit => 255
      t.string :email
      t.integer :logs_count, :default => 0
      t.integer :posts_count, :default => 0
      t.string :photo_path, :default => "default.png"
      t.string :place, :limit => 255
      t.boolean :is_first, :default => true

      t.timestamps
    end
  end
end
