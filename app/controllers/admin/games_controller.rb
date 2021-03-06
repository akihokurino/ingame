class Admin::GamesController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  PER = 50

  def index
    case params[:type]
    when "famituu"
      @q = Game.where(provider: "famituu").page(params[:page]).per(PER).order("created_at DESC").ransack(search_params)
    when "steam"
      @q = Game.where(provider: "steam").page(params[:page]).per(PER).order("created_at DESC").ransack(search_params)
    when "nothumbnail"
      @q = Game.where(photo_url: nil).where(photo_path: nil).page(params[:page]).per(PER).order("created_at DESC").ransack(search_params)
    else
      @q = Game.page(params[:page]).per(PER).order("created_at DESC").ransack(search_params)
    end

    @games = @q.result
  end

  def show
  end

  def edit
  end

  def update
    if @game.update_with_thumbnail(game_params)
      @game.create_tags params[:tags]
      @game.create_urls params[:urls]
      redirect_to admin_game_path(@game), notice: "正常に編集が完了しました。"
    else
      redirect_to edit_admin_game_path(@game), alert: "編集ができませんでした。"
    end
  end

  def new
    @game = Game.new
  end

  def create
  end

  def destroy
    if @game.destroy
      redirect_to admin_games_path, notice: "正常に削除しました。"
    else
      redirect_to admin_game_path(@game), alert: "削除ができませんでした。"
    end
  end

  private
  def set_game
    @game = Game.find params[:id]
  end

  def game_params
    params.require(:game).permit :title, :photo_path, :maker, :wiki, :price, :release_day, :device, :provider, :provider_url, :amazon_url
  end

  def search_params
    params.require(:q).permit!
  rescue
  end
end
