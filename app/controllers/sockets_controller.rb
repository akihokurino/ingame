class SocketsController < WebsocketRails::BaseController
  def initialize_session
    logger.debug("initialize socket controller")
  end

  def connect_user
    logger.debug("connected user")
  end

  def post
    @from_user = User.find(message[:from_user_id])
    @from_user.followers.each do |user|
      WebsocketRails[user[:id]].trigger "post", message
    end
  end

  def like
    @to_user = User.find(message[:to_user_id])

    WebsocketRails[@to_user[:id]].trigger "like", message

    @to_user.followers.each do |user|
      WebsocketRails[user[:id]].trigger "like", message
    end

    WebsocketRails[message[:to_user_id]].trigger "notification", message if message[:type] == "like"
  end

  def comment
    @to_user = User.find(message[:to_user_id])

    WebsocketRails[@to_user[:id]].trigger "comment", message

    @to_user.followers.each do |user|
      WebsocketRails[user[:id]].trigger "comment", message
    end

    WebsocketRails[message[:to_user_id]].trigger "notification", message if message[:type] == "comment"
  end
end
