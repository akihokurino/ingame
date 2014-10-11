var Socket = function (url, useWebsocket, eventname, callback) {
  _.bindAll(this, "receive");
  this.dispatcher = new WebSocketRails(url, useWebsocket);
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
    this.callback(data);
  }
}

var post_socket    = new Socket("localhost:3000/websocket", true, "post", null);
var like_socket    = new Socket("localhost:3000/websocket", true, "like", null);
var comment_socket = new Socket("localhost:3000/websocket", true, "comment", null);
