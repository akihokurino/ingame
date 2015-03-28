class Api::PostLikesController < ApplicationController
	def create
		params[:post_like][:user_id] = @current_user[:id]
		@result                      = PostLike.check_and_create post_like_params

		unless params[:post_like][:to_user_id]
			post = Post.find params[:post_like][:post_id]
			params[:post_like][:to_user_id] = post[:user_id]
		end

		unless @current_user[:id].to_i == params[:post_like][:to_user_id].to_i
			Notification.create from_user_id: @current_user[:id], to_user_id: params[:post_like][:to_user_id], notification_type_id: 2, post_id: params[:post_like][:post_id]
		end
	end

	def destroy
		param_hash = {user_id: @current_user[:id], post_id: params[:id]}
		@result    = PostLike.check_and_destroy param_hash
	end

	private
	def post_like_params
		params.require(:post_like).permit :post_id, :user_id
	end
end
