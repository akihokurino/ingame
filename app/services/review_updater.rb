class ReviewUpdater
  attr_accessor :params, :current_user_id

  def initialize(review, params, current_user_id)
    @review              = review
    self.params          = params
    self.current_user_id = current_user_id
  end

  def save
    ActiveRecord::Base.transaction do
      @review.update! title: self.params[:title]
      @review.update_contents! self.params[:contents]
      Post.create_review @review, self.current_user_id
    end

    true
  rescue
    raise
  end
end