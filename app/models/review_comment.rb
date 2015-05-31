class ReviewComment < ActiveRecord::Base
  belongs_to :user
  belongs_to :review, counter_cache: true
  has_many :review_comment_likes, dependent: :destroy
end
