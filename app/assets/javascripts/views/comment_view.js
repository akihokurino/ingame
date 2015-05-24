var CommentView = Backbone.View.extend({
  tagName:   "li",
  className: "item",
  events: {
    "click .like-btn":           "like",
    "click .unlike-btn":         "unlike",
    "click .comment-delete-btn": "showDeleteConfirm"
  },
  template: _.template($("#comment-template").html()),
  initialize: function () {
    _.bindAll(this, "destroy");

    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  destroy: function () {
    this.model.url += this.model.id;
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
  like: function (e) {
    e.stopPropagation();
    this.model.like();
  },
  unlike: function (e) {
    e.stopPropagation();
    this.model.unlike();
  },
  showDeleteConfirm: function () {
    var custom_modal_view = new CustomModalView({
      attributes: {
        view: this,
        title: "このコメントを削除しますか？",
        desc: null,
        template: _.template($("#delete-confirm-template").html()),
        callback: this.destroy,
        className: "deleteConfirmModal",
      }
    });
  }
});