class SocketsController < WebsocketRails::BaseController
  def initialize_session
    logger.debug("initialize socket controller")
  end

  def connect_user
    logger.debug("connected user")
  end

  def new_post
    @from_user = User.find(message[:from_user_id])
    @from_user.followers.each do |user|
      WebsocketRails[message[user[:id]]].trigger "post", message
    end
  end

  def new_like
    @to_user = User.find(message[:to_user_id])
    @to_user.followers.each do |user|
      WebsocketRails[message[user[:id]]].trigger "like", message
    end
    WebsocketRails[message[:to_user_id]].trigger "notification", message if message[:type] == "like"
  end

  def new_comment

  end
end
