class Follow < ActiveRecord::Base
	belongs_to :from_user, :class_name => "User", :foreign_key => "from_user_id"
	belongs_to :to_user, :class_name => "User", :foreign_key => "to_user_id"

	validates :from_user_id,
		presence: true,
		numericality: true
	validates :to_user_id,
		presence: true,
		numericality: true

  class << self
    def create_unless_exists?(params)
      return false if self.exists?(params[:follow])
      self.create(params) ? true : false
    end

    def destroy_if_exists?(current_user, user_id)
      return false unless self.exists?(to_user_id: user_id, from_user_id: current_user[:id])
      follow = self.find_by(to_user_id: user_id, from_user_id: current_user[:id])
      follow.destroy ? true : false
    end
  end
end
