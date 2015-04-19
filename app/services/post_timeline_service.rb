class PostTimelineService
  attr_accessor :params, :post_params, :post_url_params, :current_user

  def initialize(params, post_params, post_url_params, current_user)
    self.params          = params
    self.post_params     = post_params
    self.post_url_params = post_url_params
    self.current_user    = current_user
  end

  def exec
    result = {
      last_post: nil,
      error:     nil
    }
=begin
    begin
      ActiveRecord::Base.transaction do
        self.post_params[:post_type_id] = 1
        result[:last_post]              = Post.create! self.post_params

        if !self.params[:url_thumbnail].blank?
          self.params[:url_thumbnail][:post_id] = result[:last_post][:id]
          PostUrl.create self.post_url_params
        elsif !self.params[:post][:urls].blank?
          self.params[:post][:urls].each do |url|
            PostUrl.create_thumbnail url, result[:last_post]
          end
        end

        unless self.params[:post][:files].blank?
          result[:last_post].save_with_url self.params[:post][:files]
        end

        if self.params[:post][:post_facebook] == "true"
          result[:last_post].facebook self.current_user
        end

        if self.params[:post][:post_twitter] == "true"
          result[:last_post].twitter self.current_user
        end
      end
    rescue => e
      result[:error] =  case e.message
                        when "wrong extname or too big"
                          {type: "photo", message: "画像の拡張子が正しくないか、画像のサイズが大き過ぎます。"}
                        else
                          {type: "something", message: "不正なデータです。"}
                        end
    end
=end

    result.values_at :last_post, :error
  end
end