class UserProvider < ActiveRecord::Base
  include RandomName

  belongs_to :user

  validates :uid,
    presence: true
  validates :username,
    presence: true
  validates :service_name,
    presence: true
  validates :token,
    presence: true

  class << self
    def create_with_omniauth(auth)
      self.create! do |user_provider|
        user_provider.service_name = auth["provider"]
        user_provider.uid          = auth["uid"]
        user_provider.token        = auth["credentials"]["token"]

        case user_provider.service_name
        when "facebook"
          user_provider.username   = auth["info"]["name"].gsub(/(\s|　)+/, '')
          user_provider.photo_path = self.download_thumbnail "https://graph.facebook.com/#{auth['uid']}/picture?type=large"
        when "twitter"
          user_provider.username     = auth["info"]["nickname"].gsub(/(\s|　)+/, '')
          user_provider.secret_token = auth["credentials"]["secret"]
          user_provider.photo_path   = self.download_thumbnail auth["info"]["image"].gsub(/_normal/, '')
        end
      end
    end

    def download_thumbnail(url)
      filename = Time.now.to_i.to_s + self.generate("alphabet", 10) + ".jpg"
      filepath = "public/user_photos/#{filename}"
      begin
        File.open(filepath, 'wb') do |output|
          open(url) do |data|
            output.write data.read
          end
        end
      rescue Exception
        filename = nil
      end

      filename
    end
  end
end
