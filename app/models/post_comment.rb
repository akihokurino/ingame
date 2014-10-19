class PostComment < ActiveRecord::Base
  belongs_to :user
  belongs_to :post, counter_cache: true

  def datetime
    self[:created_at].strftime("%Y/%m/%d %H:%M:%S")
  end
end
