Rails.application.config.middleware.use OmniAuth::Builder do
    # 悪用禁止。開発期間終わったら、このAppは閉じます
    # 1. 127.0.0.1をplaydy.netにする（/etc/hosts）
    # 2. playdy.net:3000/users/login からtwitterでログインする。
  	# provider :twitter, "Consumer key", "Consumer secret"
  	provider :twitter, "rfKeEqmpWn1KWj6XKoELR54YA", "iUGETGMiVp4qCMRM9eK4H011pBdUtslVgSUPsbyZXfNUTAzOXU"

  	provider :facebook, "793985330635983", "3c7db65719c7cf71f9dda88ec4e16e77"
end
