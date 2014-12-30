class CreateUserProviders < ActiveRecord::Migration
  def change
    create_table :user_providers do |t|
      t.references :user, index: true
      t.string :uid
      t.string :username
      t.string :service_name
      t.text :token
      t.string :photo_path
      t.text :secret_token

      t.timestamps
    end
  end
end
