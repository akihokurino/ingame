class ReviewLike < ActiveRecord::Base
  belongs_to :review, counter_cache: true
  belongs_to :user

  validates :review_id,
    presence: true,
    numericality: true
  validates :user_id,
    presence: true,
    numericality: true

  class << self
    def check_and_create(review_like_params)
      return false if self.exists?(review_like_params)
      self.create(review_like_params) ? true : false
    end

    def check_and_destroy(param_hash)
      return false unless self.exists?(param_hash)
      review_like = self.find_by(param_hash)
      review_like.destroy ? true : false
    end
  end
end
