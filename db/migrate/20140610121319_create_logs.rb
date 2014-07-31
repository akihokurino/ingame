class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.text :text
      t.integer :rate

      t.references :game
      t.references :status
      t.references :user

      t.timestamps
    end
  end
end
