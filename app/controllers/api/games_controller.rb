class Api::GamesController < ApplicationController
  before_action :set_game, only: [:show]

  def show

  end

	def search
		@results = Game.where("title LIKE ?", "%#{escape_like(params[:search_title])}%").keep_if do |game|
			!@current_user.logs.pluck(:game_id).include?(game.id)
		end
	end

	private
	def escape_like(string)
	  	string.gsub(/[\\%_]/){|m| "\\#{m}"}
	end

  def set_game
    @game = Game.find(params[:id])
  end
end
