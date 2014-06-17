class Api::LogsController < ApplicationController
	def index
		@logs = Log.where(user_id: @current_user[:id]).order("created_at ASC").includes(:game)
		@statuses = Status.all
	end

	def create
		result = Game.get_from_amazon(params[:amazon_url])
		result[:release_day] = params[:release_day]
		@log = Log.create_with(result, params, @current_user)
	end

	def destroy
		log = Log.find(params[:id])
		log.destroy
		render nothing: true
	end

	def update
	end

	def delete
	end
end
