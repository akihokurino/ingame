class PostTimelineService
  attr_accessor :params, :current_user

  def initialize(params, current_user)
    self.params       = params
    self.current_user = current_user
  end

  def exec!
    ActiveRecord::Base.transaction do
      post_params[:post_type_id] = 1
      last_post                  = Post.create! post_params

      if !self.params[:url_thumbnail].blank?
        self.params[:url_thumbnail][:post_id] = last_post[:id]
        PostUrl.create post_url_params
      elsif !self.params[:post][:urls].blank?
        self.params[:post][:urls].each do |url|
          PostUrl.create_thumbnail url, last_post
        end
      end

      unless self.params[:post][:files].blank?
        last_post.save_with_url self.params[:post][:files]
      end

      if self.params[:post][:post_facebook].to_s == "true"
        last_post.facebook self.current_user
      end

      if self.params[:post][:post_twitter].to_s == "true"
        last_post.twitter self.current_user
      end

      last_post
    end
  end

  private
  def post_params
    params.require(:post).permit :user_id, :game_id, :text, :log_id
  end

  def post_url_params
    params.require(:url_thumbnail).permit :post_id, :title, :description, :thumbnail, :url, :post_type_id
  end
end