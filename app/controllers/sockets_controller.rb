class SocketsController < WebsocketRails::BaseController
  def initialize_session
    logger.debug("initialize socket controller")
  end

  def connect_user
    logger.debug("connected user")
  end

  def new_post
    #WebsocketRails[:stream].trigger "post", message
  end

  def new_like
    @from_user = User.find(message[:from_user_id])
    @from_user.follows.each do |user|
      WebsocketRails[message[user[:id]]].trigger "like", message
    end
  end

  def new_comment
    #WebsocketRails[:stream].trigger "post", message
  end
end
