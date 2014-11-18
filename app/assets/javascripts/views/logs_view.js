var LogsView = Backbone.View.extend({
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }
    this.listenTo(this.collection, "add", this.addLog);
  },
  addLog: function (log) {
    if (log.id) {
      log.set("isCurrentUserLog", log.isCurrentUserLog());
      if (this.type == "select") {
        var log_view = new LogView({model: log, attributes: {type: "select"}});
        switch (log.get("status").id) {
          case 1:
            this.$el.find(".ready-list").prepend(log_view.render().el);
            break;
          case 2:
            this.$el.find(".playing-list").prepend(log_view.render().el);
            break;
          case 3:
            this.$el.find(".played-list").prepend(log_view.render().el);
            break;
        }
      } else {
        var log_view = new LogView({model: log});
        this.$el.prepend(log_view.render().el);
      }
    }
  },
  removeLogs: function () {
    this.$el.html("");
  },
  removeEachLogs: function () {
    this.$el.find(".ready-list").html("");
    this.$el.find(".playing-list").html("");
    this.$el.find(".played-list").html("");
  }
})
