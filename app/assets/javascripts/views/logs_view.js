var LogsView = Backbone.View.extend({
  initialize: function () {

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    if (this.attributes && this.attributes.template) {
      this.template = this.attributes.template;
    }

    this.listenTo(this.collection, "add", this.addLog);
  },
  addLog: function (log) {
    if (log.id) {
      this.settingModel(log);

      if (this.type == "select") {
        var log_view = new LogView({model: log, attributes: {type: this.type, template: this.template}});
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
          case 4:
            this.$el.find(".stock-list").prepend(log_view.render().el);
            break;
        }
      } else {
        var log_view = new LogView({model: log, attributes: {template: this.template}});
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
    this.$el.find(".stock-list").html("");
  },
  renderAll: function (params) {
    var that = this;
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, option) {
    for (var i = 0; i < response.logs.length; i++) {
      var log = new Log(response.logs[i]);
      this.collection.add(log);
    }
  },
  settingModel: function (log) {
    log.set("isCurrentUserLog", log.isCurrentUserLog());
    log.strimGameTitleWidth(45);
  }
});
