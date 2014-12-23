class Admin::GamesController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin

  def index
  end
end
