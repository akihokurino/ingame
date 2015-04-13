class ReviewLike < ActiveRecord::Base
  belongs_to :game_review
  belongs_to :user
end
