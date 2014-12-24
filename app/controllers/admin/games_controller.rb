class Admin::GamesController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  PER = 50

  def index
    @games = Game.page(params[:page]).per(PER).order("created_at DESC")
  end

  def show
  end

  def edit
  end

  def update
    if @game.update game_params
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
  end

  private
  def set_game
    @game = Game.find params[:id]
  end

  def game_params
    params.require(:game).permit :title, :photo_path, :maker, :wiki, :price, :release_day, :device, :provider, :provider_url, :amazon_url
  end
end
