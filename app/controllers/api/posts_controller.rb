class Api::PostsController < ApplicationController
  def index
    page = params[:page].to_i
    return false if page < 1
    @posts = Post.get_all_posts(@current_user[:id], page)
    @games = Log.where(user_id: @current_user[:id]).select(:game_id).map { |log| log.game } if page == 1
  end

  def index_of_game
    game_id = params[:game_id]
    @all_posts = Post.get_all_posts_of_game(@current_user[:id], game_id)
    @follower_posts = Post.get_follower_posts_of_game(@current_user[:id], game_id)
  end

  def create
    params[:post][:user_id] = @current_user[:id]
    @last_post = Post.create!(post_params)
    unless params[:post][:files].blank?
      @last_post.save_files(params[:post][:files])
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
end
