class SocketsController < WebsocketRails::BaseController
  def initialize_session
    logger.debug("initialize socket controller")
  end

  def connect_user
    logger.debug("connected user")
  end

  def new_post
    WebsocketRails[:stream].trigger "post", message
  end
end
