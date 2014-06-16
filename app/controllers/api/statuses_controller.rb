class Api::StatusesController < ApplicationController
	def index
		@statuses = Status.all
	end
end
