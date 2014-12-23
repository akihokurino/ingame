class Admin::SessionsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth

  def new
  end

  def create
  end

  def destroy
  end
end
