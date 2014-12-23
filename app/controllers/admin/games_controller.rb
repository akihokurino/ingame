class Admin::GamesController < ApplicationController
  layout "application_admin"

  skip_before_action :auth

  def index
  end
end
