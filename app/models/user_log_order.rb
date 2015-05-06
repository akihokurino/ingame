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

      order_string = order.join ","

      [already_customised, order_string]
    end

    def save_order(params, current_user)
      order = params[:order].split ","
      ActiveRecord::Base.transaction do
        order.each_with_index do |o, index|
          order_num = index + 1
          status_id = Status::SLUG[o.to_sym]
          self.create! user_id: current_user[:id], status_id: status_id, order_num: order_num
        end

        true
      end
    rescue
      false
    end
  end
end
