class Review < ActiveRecord::Base
  belongs_to :user
  belongs_to :log
  belongs_to :game
  has_many :review_comments, dependent: :destroy
  has_many :review_likes, dependent: :destroy
  has_many :review_contents, dependent: :destroy

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
end
