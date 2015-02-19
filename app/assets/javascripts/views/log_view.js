var LogView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click":             "select",
    "click .delete-btn": "showDeleteConfirm"
  },
  initialize: function () {
    _.bindAll(this, "destroy");

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    if (this.attributes && this.attributes.template) {
      this.template = _.template($(this.attributes.template).html());
    }

    this.listenTo(this.model, "destroy", this.remove);
  },
  destroy: function () {
    this.model.url += this.model.get("game").id;
    this.model.destroy();
  },
  remove: function () {
    var that = this;
    this.$el.animate({
      "opacity": 0
    }, 500, function () {
      that.$el.remove();
    });
  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  select: function () {
    if (this.type == "select") {
      event_handle.publish("selectLog", this.model);
    }
  },
  showDeleteConfirm: function () {
    var custom_modal_view = new CustomModalView({
      attributes: {
        view: this,
        title: "このゲームをマイゲームから削除しますか？",
        desc: "このゲームに関する投稿データもすべて削除されます",
        template: _.template($("#delete-confirm-template").html()),
        callback: this.destroy,
        className: "deleteConfirmModal",
      }
    });
  }
});