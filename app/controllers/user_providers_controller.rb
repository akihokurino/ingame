class UserProvidersController < ApplicationController
  skip_before_action :auth, only: [:create]

  def index
    @current_user.user_providers.each do |provider|
      case provider.service_name
      when "facebook"
        @facebook_provider = provider
      when "twitter"
        @twitter_provider = provider
      end
    end
  end

  def create
    auth = request.env["omniauth.auth"]
    begin
      user_provider = UserProvider.find_by service_name: auth["provider"], uid: auth["uid"]
    rescue
      user_provider = nil
    end

    if user_provider
      if user_provider[:user_id]
        if session[:current_user_id]
          if user_provider.updateByCurrentUser(session[:current_user_id])
            redirect_to user_providers_path
          else
            redirect_to login_users_path
          end
        else
          current_user                  = user_provider.user
          session[:current_user_id]     = current_user[:id]
          session[:current_provider_id] = nil

          if current_user[:is_first]
            redirect_to "/users/#{current_user[:id]}/setting#first"
          else
            redirect_to posts_path, :notice => "ログインしました。"
          end
        end
      else
        if session[:current_user_id]
          if user_provider.updateByCurrentUser(session[:current_user_id])
            redirect_to user_providers_path
          else
            redirect_to login_users_path
          end
        else
          session[:current_provider_id] = user_provider[:id]
          redirect_to "/users/new#flow"
        end
      end
    else
      user_provider = UserProvider.create_with_omniauth auth

      if session[:current_user_id]
        if user_provider.updateByCurrentUser(session[:current_user_id])
          redirect_to user_providers_path
        else
          redirect_to login_users_path
        end
      else
        session[:current_provider_id] = user_provider[:id] if user_provider
        redirect_to "/users/new#flow"
      end
    end
  end
end
