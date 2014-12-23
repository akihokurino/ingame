class Admin::AdminsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth

  def create
  end
end
