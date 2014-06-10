class Follow < ActiveRecord::Base
	belongs_to :from_user, :class_name => "User", :foreign_key => "from_user_id"
	belongs_to :to_user, :class_name => "User", :foreign_key => "to_user_id"

	validates :from_user_id,
		presence: true,
		numericality: true
	validates :to_user_id,
		presence: true,
		numericality: true
end
