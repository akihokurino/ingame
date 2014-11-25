class Api::PostUrlsController < ApplicationController
  def new
    @result = PostUrl.tmp_thumbnail params[:url]
  end
end
