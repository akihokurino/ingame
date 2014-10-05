var LogsView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "add", this.addLog);
  },
  addLog: function (log) {
    if (log.id) {
      var log_view = new LogView({model: log});
      this.$el.prepend(log_view.render().el);
    }
  },
  removeLogs: function () {
    this.$el.html("");
  }
})
