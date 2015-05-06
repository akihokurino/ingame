class UserLogOrder < ActiveRecord::Base
  belongs_to :user
  belongs_to :status

  class << self
    def get_order(user_id)
      order = User.find(user_id).user_log_orders.order("order_num ASC").map do |user_log_order|
        user_log_order.status[:name]
      end
      already_customised = true

      if order.blank?
        order              = Status.all.pluck(:name)
        already_customised = false
      end

      [already_customised, order.join ","]
    end
  end
end
