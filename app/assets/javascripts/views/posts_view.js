var PostsView = Backbone.View.extend({
  el: ".post-list",
  initialize: function () {
    var that = this;
    _.bindAll(this, "setCollection");
    this.listenTo(this.collection, "add", this.addPost);

    like_socket.callback = function (data) {
      that.collection.find(function (model) {
        if (model.id == data.post_id) {
          if (data.type == "like") {
            model.set({
              "post_likes_count": parseInt(model.get("post_likes_count")) + 1
            }, {silent: true});
          } else if (data.type == "unlike") {
            model.set({
              "post_likes_count": parseInt(model.get("post_likes_count")) - 1
            }, {silent: true});
          }

          model.trigger("realtime_update");
        }
      });
    }

    comment_socket.callback = function (data) {
      that.collection.find(function (model) {
        if (model.id == data.post_id) {
          var new_comment_count;
          if (data.type == "comment") {
            new_comment_count = parseInt(model.get("post_comments_count")) + 1;
            model.get("post_comments").push(data.comment);
          } else if (data.type == "uncomment") {
            new_comment_count = parseInt(model.get("post_comments_count")) - 1;
          }

          model.set({"post_comments_count": new_comment_count}, {silent: true});

          model.trigger("realtime_update");
        }
      });
    }
  },
  addPost: function (post) {
    if (post.id) {
      post.strimGameTitleWidth(48).strimTextWidth(200).sanitize().sanitizeComment().getRelativeTime().getCommentRelativeTime();


      var post_view = new PostView({model: post});
      this.$el.append(post_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;

    $(window).unbind("scroll");
    this.$el.html("");

    this.pagenation = new Pagenation(this.collection, params, this.setCollection);
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, option) {
    if (response.posts && response.posts.length > 0) {
      for (var i = 0; i < response.posts.length; i++) {
        response.posts[i].post_comments.reverse();
        var post = new Post(response.posts[i]);
        this.collection.add(post);
      }

      $(window).bind("scroll", this.pagenation.load);
    }
  },
  removePosts: function () {
    this.$el.html("");
  }
});
