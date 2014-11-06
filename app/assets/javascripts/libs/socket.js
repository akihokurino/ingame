var Socket = function (useWebsocket, eventname, callback) {
  _.bindAll(this, "receive");
  this.dispatcher = new WebSocketRails(window.location.hostname + ":3001/websocket", useWebsocket);
  this.eventname  = eventname;
  this.user_id    = $("#wrapper").data("userid");
  this.callback   = callback;
  this.chanel     = this.dispatcher.subscribe(this.user_id);

  this.chanel.bind(this.eventname, this.receive);
}

Socket.prototype = {
  send: function (data) {
    this.dispatcher.trigger(this.eventname, {data: data});
  },
  receive: function (data) {
    if (this.callback) {
      this.callback(data);
    }
  }
}

var post_socket         = new Socket(true, "post", null);
var like_socket         = new Socket(true, "like", null);
var comment_socket      = new Socket(true, "comment", null);
var notification_socket = new Socket(true, "notification", null);
