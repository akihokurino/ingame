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

  default_scope {
    order("created_at DESC")
  }

  scope :all_include, -> {
    includes(:user)
  }

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

    def get_by_post(params, current_user_id)
      post_id = params[:post_id]
      type    = params[:type]
      offset  = params[:offset]
      limit   = params[:limit]

      if type == "init"
        if self.where(post_id: post_id).count > limit.to_i
          comments = self.where(post_id: post_id).limit(limit).all_include
          is_all   = false
        else
          comments = self.where(post_id: post_id).all_include
          is_all   = true
        end
      else
        comments = self.where(post_id: post_id).offset(offset).all_include
        is_all   = true
      end
      comments = self.i_like? comments, current_user_id unless current_user_id.nil?

      {post_comments: comments, is_all: is_all}
    end
  end
end
