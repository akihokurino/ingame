/*
var NodeSocket = function (eventname, callback) {
  _.bindAll(this, "receive");
  this.dispatcher = io.connect("http://localhost:3030");
  this.eventname  = eventname;
  this.user_id    = $("#wrapper").data("userid");
  this.callback   = callback;

  this.dispatcher.on("connect", function () {
    console.log("接続しました");
  });

  this.dispatcher.on(this.eventname, this.receive);

  this.dispatcher.edmit("initialize", {data: this.user_id});
}

NodeSocket.prototype = {
  send: function (data) {
    this.dispatcher.emit(this.eventname, {data: data});
  },
  receive: function (data) {
    if (this.callback) {
      this.callback(data);
    }
  }
}

var post_socket         = new NodeSocket("post", null);
var like_socket         = new NodeSocket("like", null);
var comment_socket      = new NodeSocket("comment", null);
var notification_socket = new NodeSocket("notification", null);
*/
