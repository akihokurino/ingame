class PagesController < ApplicationController
  skip_before_action :auth, only: [:term, :privacy]

  def term
  end

  def privacy
  end
end
