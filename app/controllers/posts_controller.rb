class PostsController < ApplicationController
  before_action :set_post, only: [:show]
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]

  def index
    if @current_user[:is_first]
      @current_user.update is_first: false
    end

    already_customised, order_string = UserLogOrder.get_order @current_user[:id]
    @log_order                       = order_string.split ","
    @ranking_gametags                = Gametag.custom_query "ranking"
  end

  def show
    @post.i_like? @current_user[:id] unless @current_user[:id].nil?

    @head_meta[:title]        = "#{@post.game[:title]} #{@post.user[:username]}のつぶやき - Gamr"
    @head_meta[:description]  = "#{@post.user[:username]}による#{@post.game[:title]}の感想・レビューです。"
    @head_meta[:keywords]     = "#{@post.game[:title]},#{@post.game[:device]},#{@post.game[:maker]},Gamr（ゲーマー）,#{@post.game[:title]}の感想,#{@post.game[:title]}のレビュー,#{@post.game[:title]}の評価,ゲーム,#{@post.game[:title]}のつぶやき,ゲームのSNS"
    @head_meta[:common][:url] = "http://gamr.jp/posts/#{@post[:id]}"
    if @post.game[:photo_path]
      @head_meta[:common][:image] = "http://gamr.jp/game_photos/#{@post.game[:photo_path]}"
    elsif @post.game[:photo_url]
      @head_meta[:common][:image] = @post.game[:photo_url]
    else
      @head_meta[:common][:image] = "http://gamr.jp/game_photos/default.png"
    end
  end

  def new
  end

  private
  def set_post
    @post = Post.find params[:id]
  end
end
