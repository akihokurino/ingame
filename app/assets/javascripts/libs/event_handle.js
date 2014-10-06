var EventHandle = function () {
  this.dispatcher = _.extend({}, Backbone.Events);
}

EventHandle.prototype = {
  discribe: function (event, callback) {
    this.dispatcher.on(event, callback);
  },
  publish: function (event, params) {
    this.dispatcher.trigger(event, params);
  }
}
