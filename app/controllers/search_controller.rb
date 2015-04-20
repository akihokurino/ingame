class SearchController < ApplicationController
  skip_before_action :auth, only: [:index]
  before_action :open_page, only: [:index]

  def index
    @head_meta[:title] = "ゲームやユーザーを検索 - Gamr"
  end
end
