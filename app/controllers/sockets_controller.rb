class SocketsController < WebsocketRails::BaseController
  def initialize_session
    logger.debug("initialize socket controller")
  end

  def connect_user
    logger.debug("connected user")
  end

  def post
    @from_user = User.find(message[:from_user_id])
    @from_user.follower_users.each do |user|
      WebsocketRails[user[:id]].trigger "post", message
    end

    File.open("/tmp/log", "wb") do |f|
      f.write "test"
    end
  end

  def like
    @to_user = User.find(message[:to_user_id])

    WebsocketRails[@to_user[:id]].trigger "like", message unless @to_user[:id] == message[:from_user_id]

    @to_user.follower_users.each do |user|
      WebsocketRails[user[:id]].trigger "like", message unless user[:id] == message[:from_user_id]
    end

    if @to_user[:id] != message[:from_user_id] && (message[:type] == "like" || message[:type] == "comment_like")
      WebsocketRails[message[:to_user_id]].trigger "notification", message
    end
  end

  def comment
    @to_user = User.find(message[:to_user_id])

    WebsocketRails[@to_user[:id]].trigger "comment", message unless @to_user[:id] == message[:from_user_id]

    @to_user.follower_users.each do |user|
      WebsocketRails[user[:id]].trigger "comment", message unless user[:id] == message[:from_user_id]
    end

    if @to_user[:id] != message[:from_user_id] && message[:type] == "comment"
      WebsocketRails[message[:to_user_id]].trigger "notification", message
    end
  end
end
