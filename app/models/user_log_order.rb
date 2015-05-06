class UserLogOrder < ActiveRecord::Base
  belongs_to :user
  belongs_to :status

  class << self
    def getOrder(user_id)
      order = User.find(user_id).user_log_orders.order("order_num ASC").map do |user_log_order|
        user_log_order.status[:name]
      end

      order = Status.all.pluck(:name) if order.blank?

      order.join ","
    end
  end
end
