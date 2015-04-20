class Api::SessionsController < ApplicationController
  skip_before_action :auth, only: [:create]
  before_action :auth_provider, only: [:create]

  def create
    if current_user = User.authenticate(params[:user][:username], params[:user][:password])
      current_user.connect_with_provider @current_provider
      session[:current_user_id]     = current_user[:id]
      session[:current_provider_id] = nil

      if current_user[:is_first]
        @result = "/users/#{current_user[:id]}/setting#first"
      else
        @result = "/posts"
      end
    else
      @result = false
    end
  end
end
