Rails.application.config.middleware.use OmniAuth::Builder do
  	provider :twitter, "Consumer key", "Consumer secret"
  	provider :facebook, "793985330635983", "3c7db65719c7cf71f9dda88ec4e16e77"
end
