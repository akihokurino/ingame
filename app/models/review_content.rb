class ReviewContent < ActiveRecord::Base
  belongs_to :review
  belongs_to :review_content_type

  default_scope {
    includes :review_content_type
  }
end
