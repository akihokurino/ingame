class Status < ActiveRecord::Base
	has_many :logs
  has_many :user_log_orders

  validates :name,
    presence: true,
    uniqueness: true,
    length: {maximum: 50}

  SLUG = {ready: 1, playing: 2, played: 3, stock: 4}
end
