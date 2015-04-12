module PostFacebook
  extend ActiveSupport::Concern

  def post_facebook(current_user)
    current_provider = nil
    current_user.user_providers.each do |user_provider|
      current_provider = user_provider if user_provider[:service_name] == "facebook"
    end

    return false unless current_provider

    me = FbGraph::User.me current_provider[:token]
    me.feed!(
      :message     => self[:text],
      #:picture    => 'https://graph.facebook.com/matake/picture',
      #:link       => 'https://github.com/bussorenre',
      :name        => "Gameful",
      :description => "Posted from Gameful"
    )
  end
end