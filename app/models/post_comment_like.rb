class PostCommentLike < ActiveRecord::Base
  belongs_to :post_comment, counter_cache: true
  belongs_to :user

  validates :post_comment_id,
    presence: true,
    numericality: true
  validates :user_id,
    presence: true,
    numericality: true

  class << self
    def check_and_create(post_comment_like_params)
      return false if self.exists?(post_comment_like_params)
      self.create(post_comment_like_params) ? true : false
    end

    def check_and_destroy(param_hash)
      return false unless self.exists?(param_hash)
      post_comment_like = self.find_by param_hash
      post_comment_like.destroy ? true : false
    end
  end
end
