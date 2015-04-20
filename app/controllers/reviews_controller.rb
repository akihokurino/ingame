class ReviewsController < ApplicationController
  skip_before_action :auth, only: [:show]
  before_action :open_page, only: [:show]

  def show

  end

  def new

  end

  def create

  end
end
