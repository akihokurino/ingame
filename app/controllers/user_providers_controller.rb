class UserProvidersController < ApplicationController
  skip_before_action :auth, only: [:create]

  def create
    auth = request.env["omniauth.auth"]
    begin
      user_provider = UserProvider.find_by(type: auth["provider"], uid: auth["uid"])
    rescue
      user_provider = nil
    end

    if user_provider
      if user_provider[:user_id]
        current_user              = user_provider.user
        session[:current_user_id] = current_user[:id]

        if current_user[:is_first]
          redirect_to "/users/#{user[:id]}/setting#first"
        else
          redirect_to posts_path, :notice => "ログインしました。"
        end
      else
        session[:current_provider_name] = user_provider.set_omniauth_session
        redirect_to "/users/new#flow"
      end
    else
      session[:current_provider_name] = UserProvider.create_with_omniauth(auth)
      redirect_to "/users/new#flow"
    end
  end
end
