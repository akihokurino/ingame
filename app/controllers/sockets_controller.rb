class SocketsController < WebsocketRails::BaseController
  def initialize_session

  end

  def connect_user

  end

  def post
    @from_user = User.find message[:from_user_id]
    @from_user.followers.each do |follow|
      WebsocketRails[follow.from_user[:id]].trigger "post", message
    end
  end

  def like
    @to_user = User.find message[:to_user_id]

    WebsocketRails[@to_user[:id]].trigger "like", message unless @to_user[:id] == message[:from_user_id]

    @to_user.followers.each do |follow|
      WebsocketRails[follow.from_user[:id]].trigger "like", message unless follow.from_user[:id] == message[:from_user_id]
    end

    if @to_user[:id] != message[:from_user_id] && (message[:type] == "like" || message[:type] == "comment_like")
      WebsocketRails[@to_user[:id]].trigger "notification", message
    end
  end

  def comment
    @to_user = User.find message[:to_user_id]

    WebsocketRails[@to_user[:id]].trigger "comment", message unless @to_user[:id] == message[:from_user_id]

    @to_user.followers.each do |follow|
      WebsocketRails[follow.from_user[:id]].trigger "comment", message unless follow.from_user[:id] == message[:from_user_id]
    end

    if @to_user[:id] != message[:from_user_id] && message[:type] == "comment"
      WebsocketRails[@to_user[:id]].trigger "notification", message
    end
  end
end
