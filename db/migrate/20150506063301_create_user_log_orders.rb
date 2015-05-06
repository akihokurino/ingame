class CreateUserLogOrders < ActiveRecord::Migration
  def change
    create_table :user_log_orders do |t|
      t.references :user, index: true
      t.references :status, index: true
      t.integer :order_num

      t.timestamps
    end
  end
end
