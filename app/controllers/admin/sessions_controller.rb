class Admin::SessionsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin, only: [:destroy]

  def new
  end

  def create
  end

  def destroy
  end
end
