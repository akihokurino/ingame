class AddColumnOfRateToLog < ActiveRecord::Migration
  def change
    add_column :logs, :rate, :integer
  end
end
