class Admin::Api::AdminsController < ApplicationController
  skip_before_action :auth
  skip_before_action :verify_authenticity_token

  def create
    admin_params = {
      username: params[:username],
      password: params[:password]
    }
    @result = Admin.create_with_password(admin_params) ? true : false
  end
end
