class Api::LogsController < ApplicationController
	def index
		@logs = Log.where(user_id: @current_user[:id]).order("created_at ASC").includes(:game)
		@statuses = Status.all
	end

	def create
		result = Game.get_from_amazon(params[:amazon_url])
		result[:release_day] = params[:release_day]
		begin
			ActiveRecord::Base.transaction do
				game = Game.find_or_create!(result)
				Log.create!({
					game_id: game[:id],
					status_id: params[:status_id],
					user_id: @current_user[:id],
					text: params[:text]
				})
				@log = Log.last
			end
		rescue
			raise
		end
	end

	def update
	end

	def delete
	end
end
