class UserProvider < ActiveRecord::Base
  belongs_to :user

  def set_omniauth_session
    case self[:type]
    when "facebook"
      auth["info"]["name"]
    when
      auth["info"]["nickname"]
    end
  end

  class << self
    def create_with_omniauth(auth)
      current_provider_name = nil

      self.create! do |user_provider|
        user_provider.type  = auth["provider"]
        user_provider.uid   = auth["uid"]
        user_provider.token = auth["credentials"]["token"]

        case user_provider.type
        when "facebook"
          current_provider_name      = auth["info"]["name"]
        when "twitter"
          current_provider_name      = auth["info"]["nickname"]
          user_provider.secret_token = auth["credentials"]["secret"]
        end
      end

      current_provider_name
    end
  end
end
