class ReviewComment < ActiveRecord::Base
  belongs_to :user
  belongs_to :game_review
  has_many :review_comment_likes, dependent: :destroy
end
