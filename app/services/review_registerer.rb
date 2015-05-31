class ReviewRegisterer
  attr_accessor :params, :contents, :current_user_id

  def initialize(params, current_user_id)
    self.params          = params
    self.current_user_id = current_user_id
  end

  def save
    ActiveRecord::Base.transaction do
      current_log = Log.find_by user_id: self.current_user_id, game_id: self.params[:game_id]
      current_log.update! rate: self.params[:rate]

      review = Review.create! user_id: self.current_user_id, log_id: current_log[:id], game_id: self.params[:game_id], title: self.params[:title]

      review.create_contents! self.params[:contents]
    end

    true
  rescue
    raise
  end
end