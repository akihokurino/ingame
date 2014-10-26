var LogView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click":             "select",
    "click .delete-btn": "showDeleteConfirm"
  },
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    this.listenTo(this.model, "destroy", this.remove);
  },
  destroy: function () {
    this.model.url += this.model.id;
    this.model.destroy();
  },
  remove: function () {
    this.$el.remove();
  },
  template: _.template($("#log-template").html()),
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
    $(".delete-confirm-wrap").css("display", "block");
    $(".layer").css("display", "block");
    var delete_confirm_view = new DeleteConfirmView({attributes: {view: this, target: "ログ", desc: "ログに関する投稿データは全て削除されます。"}});
  }
})