class ReviewCommentLike < ActiveRecord::Base
  belongs_to :review_comment
  belongs_to :user
end
