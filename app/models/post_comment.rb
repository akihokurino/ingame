class PostComment < ActiveRecord::Base
  belongs_to :user
  belongs_to :post, counter_cache: true
  has_many   :comment_likes

  validates :post_id,
    presence: true,
    numericality: true
  validates :user_id,
    presence: true,
    numericality: true
  validates :comment_likes_count,
    numericality: true
  validates :text,
    presence: true

  attr_accessor :i_liked

  def datetime
    self[:created_at].strftime("%Y/%m/%d %H:%M:%S")
  end

  class << self
    def i_like?(post_comment_args, current_user_id)
      post_comment_args.map do |post_comment|
        post_comment.i_liked = post_comment.comment_likes.pluck(:user_id).include?(current_user_id) ? true : false
        post_comment
      end
    end
  end
end
