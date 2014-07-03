class Api::PostsController < ApplicationController
	def index
		@posts = Post.get_all_posts(@current_user[:id])
		@games = Log.where(user_id: @current_user[:id]).select(:game_id).map { |log| log.game }
	end

	def create
		params[:post][:user_id] = @current_user[:id]
		Post.create!(post_params)
		@last_post = Post.last
	end

	def destroy
		post = Post.find(params[:id])
		post.destroy
		render :nothing => true
	end

	private
	def post_params
		params.require(:post).permit(:user_id, :game_id, :text)
	end
end
