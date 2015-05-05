module PostTwitter
  extend ActiveSupport::Concern

  def post_twitter(current_provider, text)

    # return false if Rails.env == "development"

    return false unless current_provider

    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "o0oeDXJ131ufgroZv1ur7sZ6E"
      config.consumer_secret     = "e3yyRbH2s4eI4AuFrtMMKwxGTi7ZHF00qslNWbYKzClMWgmWJf"
      config.access_token        = current_provider[:token]
      config.access_token_secret = current_provider[:secret_token]
    end

    client.update text
  end
end