class Review < ActiveRecord::Base
  belongs_to :user
  belongs_to :log
  belongs_to :game
  has_many :review_comments, dependent: :destroy
  has_many :review_likes, dependent: :destroy
  has_many :review_contents, dependent: :destroy

  attr_accessor :i_liked

  LIMIT = 20

  def create_contents!(contents)
    contents.each do |content|
      index = content[0].to_i + 1
      hash  = content[1]
      review_content_type = ReviewContentType.find_by name: hash[:type]
      new_content = {
        review_content_type_id: review_content_type[:id],
        body:  hash[:value],
        order: index
      }

      self.review_contents.create! new_content
    end
  end

  class << self
    def custom_query(current_user, params)
      type    = params[:type]
      game_id = params[:game_id]
      page    = params[:page].to_i
      return self.none if page < 1

      case type
      when "all_of_game"
        self.get_all_reviews_of_game current_user[:id], game_id, page
      else
        self.none
      end
    end

    def get_all_reviews_of_game(current_user_id, game_id, page)
      return self.none if current_user_id.nil?

      offset  = (page - 1) * LIMIT
      reviews = self.where(game_id: game_id).order("created_at DESC").limit(LIMIT).offset(offset)
      reviews = self.i_like? reviews, current_user_id

      reviews
    end

    def i_like?(reviews, current_user_id)
      reviews.map do |review|
        review.i_liked = review.review_likes.pluck(:user_id).include?(current_user_id) ? true : false
        review
      end
    end
  end
end
