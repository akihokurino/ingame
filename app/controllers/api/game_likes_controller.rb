class Api::GameLikesController < ApplicationController
	def create
		params[:game_like][:user_id] = @current_user[:id]
		@result                      = GameLike.check_and_create(game_like_params)
	end

	def destroy
		param_hash = {user_id: @current_user[:id], game_id: params[:game_id]}
		@result    = GameLike.check_and_destroy(param_hash)
	end

	private
	def game_like_params
		params.require(:game_like).permit(:game_id, :user_id)
	end
end
