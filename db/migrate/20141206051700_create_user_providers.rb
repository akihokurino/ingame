class CreateUserProviders < ActiveRecord::Migration
  def change
    create_table :user_providers do |t|
      t.references :user, index: true
      t.string :uid
      t.string :type
      t.text :token
      t.text :secret_token

      t.timestamps
    end
  end
end
