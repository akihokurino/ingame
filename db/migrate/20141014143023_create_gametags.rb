class CreateGametags < ActiveRecord::Migration
  def change
    create_table :gametags do |t|
      t.string :name, unique: true, limit: 255

      t.timestamps
    end
  end
end
