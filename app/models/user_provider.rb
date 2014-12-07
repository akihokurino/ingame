class UserProvider < ActiveRecord::Base
  belongs_to :user

  class << self
    def create_with_omniauth(auth)
      self.create! do |user_provider|
        user_provider.service_name = auth["provider"]
        user_provider.uid          = auth["uid"]
        user_provider.token        = auth["credentials"]["token"]

        case user_provider.service_name
        when "facebook"
          user_provider.username = auth["info"]["name"]
        when "twitter"
          user_provider.username     = auth["info"]["nickname"]
          user_provider.secret_token = auth["credentials"]["secret"]
        end
      end
    end
  end
end
