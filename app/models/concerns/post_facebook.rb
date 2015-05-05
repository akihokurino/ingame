module PostFacebook
  extend ActiveSupport::Concern

  def post_facebook(current_provider)

    return false if Rails.env == "development"

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