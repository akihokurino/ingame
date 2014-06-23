class Api::PostLikesController < ApplicationController
	def create
		params[:post_like][:user_id] = @current_user[:id]
		@result = PostLike.check_and_create(post_like_params)
	end

	def destroy
		param_hash = {user_id: @current_user[:id], post_id: params[:id]}
		@result = PostLike.check_and_destroy(param_hash)
	end

	private
	def post_like_params
		params.require(:post_like).permit(:post_id, :user_id)
	end
end
