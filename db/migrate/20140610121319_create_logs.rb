class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.integer :game_id
      t.integer :status_id
      t.integer :user_id
      t.text :text

      t.timestamps
    end
  end
end
