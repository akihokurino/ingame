class Api::PostsController < ApplicationController
  def index
    type    = params[:type]
    game_id = params[:game_id]
    page    = params[:page].to_i
    return false if page < 1

    case type
    when "user"
      @posts = Post.get_user_posts(@current_user[:id], params[:user_id], page)
    when "all_of_game"
      @posts = Post.get_all_posts_of_game(@current_user[:id], game_id, page)
    when "follower_of_game"
      @posts = Post.get_follower_posts_of_game(@current_user[:id], game_id, page)
    when "liker_of_game"
      @posts = Post.get_liker_posts_of_game(@current_user[:id], game_id, page)
    else
      @posts = Post.get_all_posts(@current_user[:id], page)
    end
  end

  def create
    params[:post][:user_id] = @current_user[:id]
    @last_post              = Post.create!(post_params)

    if params[:post_youtube][:key]
      params[:post_youtube][:post_id] = @last_post[:id]
      PostYoutube.create(post_youtube_params)
    elsif params[:url_thumbnail]
      params[:url_thumbnail][:post_id] = @last_post[:id]
      PostUrl.create(post_url_params)
    elsif !params[:post][:urls].blank?
      params[:post][:urls].each do |url|
        PostUrl.create_thumbnail(url, @last_post)
      end
    end

    case params[:post][:provider]
    when "facebook"
      @last_post.facebook(@current_user)
    when "twitter"
      @last_post.twitter(@current_user)
    end

    unless params[:post][:files].blank?
      @last_post.save_with(params[:post][:files])
    end
  end

  def destroy
    post = Post.find(params[:id])
    post.destroy
    render :nothing => true
  end

  private
  def post_params
    params.require(:post).permit(:user_id, :game_id, :text, :log_id)
  end

  def post_url_params
    params.require(:url_thumbnail).permit(:post_id, :title, :description, :thumbnail, :url)
  end

  def post_youtube_params
    params.require(:post_youtube).permit(:post_id, :key)
  end
end
