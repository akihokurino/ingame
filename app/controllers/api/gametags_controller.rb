class Api::GametagsController < ApplicationController
  def index
    @gametags = Gametag.custom_query params[:type]
  end
end
