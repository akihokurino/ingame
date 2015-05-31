var PostView = Backbone.View.extend({
  tagName:   "article",
  className: "postBox",
  events: {
    "click .delete":          "destroy",
    "click .like-btn":        "like",
    "click .unlike-btn":      "unlike",
    "keydown .comment-input": "comment",
    "click .comment-like":    "commentLike",
    "click .comment-unlike":  "commentUnlike",
    "click .delete-btn":      "showDeleteConfirm"
  },
  normal_template:   _.template($("#post-template").html()),
  activity_template: _.template($("#post-activity-template").html()),
  review_template:   _.template($("#post-review-template").html()),
  initialize: function () {
    _.bindAll(this, "destroy", "realtimeUpdate");

    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "realtime_update", this.realtimeUpdate);

    this.$el.find(".comment-input").autosize();
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
    switch (this.model.get("post_type")) {
      case "normal":
        var template = this.normal_template(this.model.toJSON());
        break;
      case "activity":
        var template = this.activity_template(this.model.toJSON());
        break;
      case "review":
        var template = this.review_template(this.model.toJSON());
        break;
      default:
        var template = this.normal_template(this.model.toJSON());
        break;
    }

    this.$el.html(template);

    if (type !== "silent") {
      this.$el.css("opacity", 0).animate({"opacity": 1}, 500, function () {});
    }

    return this;
  },
  realtimeUpdate: function () {
    this.render("silent");
  },
  like: function () {
    var that = this;
    this.model.like(function () { that.render("silent"); });
  },
  unlike: function () {
    var that = this;
    this.model.unlike(function () { that.render("silent"); });
  },
  comment: function (e) {
    var comment_input = this.$el.find(".comment-input");
    if (e.which == 13 && !e.shiftKey && comment_input.val().replace(/^\s+|\s+$/g, "") != "") {
      var that = this;
      var text = comment_input.val();
      this.model.comment(text, function () { that.render("silent"); });
      comment_input.val("");
    }
  },
  commentLike: function (e) {
    var that = this;
    this.model.commentLike($(e.currentTarget).data("commentindex"), function () { that.render("silent"); })
  },
  commentUnlike: function (e) {
    var that = this;
    this.model.commentUnlike($(e.currentTarget).data("commentindex"), function () { that.render("silent"); });
  },
  showDeleteConfirm: function () {
    var custom_modal_view = new CustomModalView({
      attributes: {
        view: this,
        title: "この投稿を削除しますか？",
        desc: null,
        template: _.template($("#delete-confirm-template").html()),
        callback: this.destroy,
        className: "deleteConfirmModal",
      }
    });
  }
});
