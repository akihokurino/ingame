class Api::PostsController < ApplicationController
	def index
		@posts = Post.where(user_id: @current_user[:id]).includes(:game).includes(:user)
	end

	def create
		params[:post][:user_id] = @current_user[:id]
		p post_params
		Post.create!(post_params)
		@last_post = Post.last
	end

	private
	def post_params
		params.require(:post).permit(:user_id, :game_id, :text)
	end
end
