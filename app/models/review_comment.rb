class ReviewComment < ActiveRecord::Base
  belongs_to :user
  belongs_to :review
  has_many :review_comment_likes, dependent: :destroy
end
