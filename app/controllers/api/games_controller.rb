class Api::GamesController < ApplicationController
	def index
		@games = Game.all.select(:id, :title)
	end
end
