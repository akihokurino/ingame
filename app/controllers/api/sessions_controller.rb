class Api::SessionsController < ApplicationController
  skip_before_action :auth, only: [:create]
  before_action :auth_provider, only: [:create], :unless => :original?

  def create
    if current_user = User.authenticate(params[:user][:username], params[:user][:password])
      current_user.connect_with_provider @current_provider unless @current_provider.nil?

      session[:current_user_id]     = current_user[:id]
      session[:current_provider_id] = nil

      @result = current_user[:is_first] ? "/users/#{current_user[:id]}/setting#first" : "/posts"
    else
      @result = false
    end
  end

  private
  def original?
    !params[:is_original].blank? && params[:is_original] == "true"
  end
end
