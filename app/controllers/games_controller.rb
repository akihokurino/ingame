class GamesController < ApplicationController
	before_action :set_game, only: [:show]
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]

	def show
    @game.format_datetime

    unless @current_user[:id].nil?
      @game.check_regist @current_user
      @game.check_rate @current_user
    end

    @head_meta[:title]        = "#{@game[:title]}の感想・レビュー・つぶやき - Gamr"
    @head_meta[:description]  = "#{@game[:title]}の感想やレビュー、つぶやきのまとめページです。ゲームの概要や画像も掲載中！"
    @head_meta[:keywords]     = "#{@game[:title]},#{@game[:device]},#{@game[:maker]},Gamr（ゲーマー）,#{@game[:title]}の感想,#{@game[:title]}のレビュー,#{@game[:title]}の評価,ゲーム,#{@game[:title]}のつぶやき,ゲームのSNS"
    @head_meta[:common][:url] = "http://gamr.jp/games/#{@game[:id]}#all"
    if @game[:photo_path]
      @head_meta[:common][:image] = "http://gamr.jp/game_photos/#{@game[:photo_path]}"
    elsif @game[:photo_url]
      @head_meta[:common][:image] = @game[:photo_url]
    else
      @head_meta[:common][:image] = "http://gamr.jp/game_photos/default.png"
    end
	end

  def devices

  end

	private
	def set_game
		@game = Game.find params[:id]
	end
end
