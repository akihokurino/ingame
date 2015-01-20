class Status < ActiveRecord::Base
	has_many :logs

  validates :name,
    presence: true,
    uniqueness: true,
    length: {maximum: 50}
end
