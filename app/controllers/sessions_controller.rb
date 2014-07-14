class SessionsController < ApplicationController
	skip_before_action :auth, only: [:callback]

	def callback
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"])
    if user
      session[:current_user_id] = user[:id]

      if user[:is_first]
        redirect_to "/users/#{user[:id]}/setting#first"
      else
        redirect_to posts_path, :notice => "ログインしました。"
      end
    else
      User.create_with_omniauth(auth)
      session[:current_user_id] = User.last[:id]
      redirect_to "/users/#{session[:current_user_id]}/setting#first"
    end
  end
end
