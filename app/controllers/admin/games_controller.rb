class Admin::GamesController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin
  before_action :set_game, only: [:show, :edit, :update]

  PER = 50

  def index
    @games = Game.page(params[:page]).per(PER).order("created_at DESC")
  end

  def show
  end

  def edit
  end

  def update
  end

  def new
  end

  def create
  end

  private
  def set_game
    @game = Game.find params[:id]
  end
end
