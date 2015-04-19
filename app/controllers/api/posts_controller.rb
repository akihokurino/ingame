class Api::PostsController < ApplicationController
  skip_before_action :auth, only: [:index]
  before_action :open_page, only: [:index]

  def index
    type    = params[:type]
    game_id = params[:game_id]
    page    = params[:page].to_i
    return false if page < 1

    @posts  = Post.custom_query type, @current_user, params, page, game_id
  end

  def create
    params[:post][:user_id] = @current_user[:id]
    begin
      ActiveRecord::Base.transaction do
        post_params[:post_type_id] = 1
        @last_post = Post.create! post_params

        if !params[:url_thumbnail].blank?
          params[:url_thumbnail][:post_id] = @last_post[:id]
          PostUrl.create post_url_params
        elsif !params[:post][:urls].blank?
          params[:post][:urls].each do |url|
            PostUrl.create_thumbnail url, @last_post
          end
        end

        unless params[:post][:files].blank?
          @last_post.save_with_url params[:post][:files]
        end

        if params[:post][:post_facebook] == "true"
          @last_post.facebook @current_user
        end

        if params[:post][:post_twitter] == "true"
          @last_post.twitter @current_user
        end
      end
    rescue => e
      case e.message
      when "wrong extname or too big"
        @error = {type: "photo", message: "画像の拡張子が正しくないか、画像のサイズが大き過ぎます。"}
      else
        @error = {type: "something", message: "不正なデータです。"}
      end
    end
  end

  def destroy
    @result = Post.destroy(params[:id]) ? true : false
  end

  private
  def post_params
    params.require(:post).permit :user_id, :game_id, :text, :log_id
  end

  def post_url_params
    params.require(:url_thumbnail).permit :post_id, :title, :description, :thumbnail, :url, :post_type_id
  end
end
