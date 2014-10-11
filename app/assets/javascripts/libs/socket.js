var Socket = function (url, useWebsocket, eventname, callback) {
  this.dispatcher = new WebSocketRails(url, useWebsocket);
  this.eventname  = eventname;
  this.user_id    = $("#wrapper").data("userid");
  this.callback   = callback;
  this.dispatcher.bind(this.eventname, this.receive);
  this.dispatcher.subscribe(this.user_id);
}

Socket.prototype = {
  send: function (data) {
    this.dispatcher.trigger(this.eventname, {data: data});
  },
  receive: function (data) {
    console.log(data);
  }
}

var post_socket    = new Socket("localhost:3000/websocket", true, "post", null);
var like_socket    = new Scoket("localhost:3000/websocket", true, "like", null);
var comment_socket = new Socket("localhost:3000/websocket", true, "comment", null);
