class SettingProviderService
  attr_accessor :auth, :session

  def initialize(auth, session)
    self.auth    = auth
    self.session = session
  end

  def update
    begin
      user_provider = UserProvider.find_by service_name: self.auth["provider"], uid: self.auth["uid"]
    rescue
      user_provider = nil
    end

    if user_provider
      if user_provider[:user_id]
        if self.session[:current_user_id]
          return user_provider.updateByCurrentUser(self.session[:current_user_id]) ? "to-provider-setting" : "to-login"
        else
          current_user                       = user_provider.user
          self.session[:current_user_id]     = current_user[:id]
          self.session[:current_provider_id] = nil

          return current_user[:is_first] ? "to-user-setting" : "to-timeline"
        end
      else
        if self.session[:current_user_id]
          return user_provider.updateByCurrentUser(self.session[:current_user_id]) ? "to-provider-setting" : "to-login"
        else
          self.session[:current_provider_id] = user_provider[:id]
          return "to-create-user"
        end
      end
    else
      user_provider = UserProvider.create_with_omniauth auth

      if self.session[:current_user_id]
        return user_provider.updateByCurrentUser(self.session[:current_user_id]) ? "to-provider-setting" : "to-login"
      else
        self.session[:current_provider_id] = user_provider[:id] if user_provider
        return "to-create-user"
      end
    end
  end
end