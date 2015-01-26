class NotificationType < ActiveRecord::Base
  has_many :notifications

  validates :value,
    presence: true,
    uniqueness: true,
    length: {maximum: 255}
end
