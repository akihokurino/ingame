class UserProvidersController < ApplicationController
  skip_before_action :auth, only: [:create]

  def index
    @facebook_provider, @twitter_provider = @current_user.current_providers
  end

  def create
    redirect_to case SettingProviderService.new(request.env["omniauth.auth"], session).update
                when "to-provider-setting"
                  user_providers_path
                when "to-login"
                  login_users_path
                when "to-user-setting"
                  "/users/#{current_user[:id]}/setting#first"
                when "to-timeline"
                  posts_path
                when "to-create-user"
                  "/users/new#flow"
                end
  end
end
