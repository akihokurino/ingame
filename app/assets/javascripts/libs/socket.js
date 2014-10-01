var Socket = function (url, useWebsocket, eventname, callback) {
  this.dispatcher = new WebSocketRails(url, useWebsocket);
  this.eventname  = eventname;
  this.dispatcher.subscribe("stream");
  this.dispatcher.bind(this.eventname, this.receive);
}

Socket.prototype = {
  send: function (data) {
    this.dispatcher.trigger(this.eventname, {data: data});
  },
  receive: function (data) {
    console.log(data);
  }
}