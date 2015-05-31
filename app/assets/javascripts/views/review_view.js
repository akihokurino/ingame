var ReviewView = Backbone.View.extend({
  tagName:   "article",
  className: "reviewBox",
  events: {
    "click .delete":     "destroy",
    "click .like-btn":   "like",
    "click .unlike-btn": "unlike",
    "click .delete-btn": "showDeleteConfirm"
  },
  template: _.template($("#review-template").html()),
  initialize: function () {
    _.bindAll(this, "destroy");

    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
  },
  destroy: function () {
    this.model.url += this.model.id;
    this.model.destroy();
  },
  remove: function () {
    var that = this;
    this.$el.animate({"opacity": 0}, 500, function () {
      that.$el.remove();
    });
  },
  render: function (type) {
    this.$el.html(this.template(this.model.toJSON()));

    if (type !== "silent") {
      this.$el.css("opacity", 0).animate({"opacity": 1}, 500, function () {});
    }

    return this;
  },
  like: function () {
    var that = this;
    this.model.like(function () { that.render("silent"); });
  },
  unlike: function () {
    var that = this;
    this.model.unlike(function () { that.render("silent"); });
  },
  showDeleteConfirm: function () {
    var custom_modal_view = new CustomModalView({
      attributes: {
        view: this,
        title: "このレビューを削除しますか？",
        desc: null,
        template: _.template($("#delete-confirm-template").html()),
        callback: this.destroy,
        className: "deleteConfirmModal",
      }
    });
  }
});
