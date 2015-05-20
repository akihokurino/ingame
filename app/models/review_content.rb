class ReviewContent < ActiveRecord::Base
  belongs_to :review
  belongs_to :review_content_type
end
