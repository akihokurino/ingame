class GameReview < ActiveRecord::Base
  belongs_to :user
  belongs_to :log
  belongs_to :game
  has_many :review_comments, dependent: :destroy
  has_many :review_likes, dependent: :destroy
end
