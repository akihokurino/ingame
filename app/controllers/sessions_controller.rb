class SessionsController < ApplicationController
	skip_before_action :auth, only: [:callback]

	def callback
    	auth = request.env["omniauth.auth"]
    	user = User.find_by_provider_and_uid(auth["provider"], auth["uid"])
    	if user
       		session[:current_user_id] = user[:id]
       		redirect_to posts_path, :notice => "ログインしました。"
    	else
       		User.create_with_omniauth(auth)
       		session[:current_user_id] = User.last[:id]
       		redirect_to posts_path, :notice => "#{auth["info"]["name"]}さんの#{auth["provider"]}アカウントと接続しました。"
    	end
  	end
end
