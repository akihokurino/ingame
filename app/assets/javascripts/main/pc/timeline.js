//= require ../../libs/socket.js
//= require ../../models/post.js
//= require ../../models/log.js
//= require ../../models/user.js
//= require ../../collections/posts.js
//= require ../../collections/logs.js
//= require ../../collections/users.js
//= require ../../views/delete_confirm_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/user_view.js
//= require ../../views/users_view.js
//= require ../../libs/post_upload.js



(function () {
  var AppView = Backbone.View.extend({
    el: ".timeline-page",
    events: {
      "click .show-select-modal": "toggleSelectModal",
      "click .post-btn":          "post",
      "keyup .post-input":        "checkUrl"
    },
    initialize: function () {
      _.bindAll(this, "pagenation", "selectLog");

      var that                = this;
      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({collection: this.post_collection});
      this.log_collection     = new Logs();
      this.logs_view          = new LogsView({el: ".select-log-list", collection: this.log_collection, attributes: {type: "select", template: "#log-option-template"}});
      this.user_collection    = new Users();
      this.users_view         = new UsersView({el: ".user-activity-list", collection: this.user_collection, attributes: {type: "activity", template: "#user-activity-template"}});

      this.post_input         = this.$(".post-input");
      this.select_log_id      = null;
      this.select_game_id     = null;
      this.provider           = null;
      this.comment_input      = this.$(".comment-input");
      this.user_id            = $("#wrapper").data("userid");
      this.page               = 1;

      event_handle.discribe("selectLog", this.selectLog);

      this.upload             = new PostUpload("upload-btn", "thumbnail");

      this.current_access_url = null;
      this.prev_access_url    = null;

      this.url_thumbnail          = null;
      this.url_thumbnail_template = _.template($("#url-thumbnail-template").html());

      $(".post-input").autosize();


      like_socket.callback = function (data) {
        that.post_collection.find(function (model) {
          if (model.id == data.post_id) {
            if (data.type == "like") {
              model.set({
                "post_likes_count": parseInt(model.get("post_likes_count")) + 1
              });
            } else if (data.type == "unlike") {
              model.set({
                "post_likes_count": parseInt(model.get("post_likes_count")) - 1
              });
            }

            /*
            if (data.type == "comment_like") {
              for (var i = 0; i < model.get("post_comments").length; i++) {
                var comment = model.get("post_comments")[i];
                if (comment.id == data.post_comment_id) {
                  new_comment_like_count = parseInt(comment.get("comment_likes_count")) + 1;
                }
              }
            } else if (data.type == "comment_unlike") {
              for (var i = 0; i < model.get("post_comments").length; i++) {
                var comment = model.get("post_comments")[i];
                if (comment.id == data.post_comment_id) {
                  new_comment_like_count = parseInt(comment.get("comment_likes_count")) - 1;
                }
              }
            }
            */
          }
        });
      }

      post_socket.callback = function (data) {
        var post      = new Post(data.post);
        that.posts_view.collection.add(post, {silent: true});
        var post_view = new PostView({model: post});
        that.posts_view.$el.prepend(post_view.render().el);
      }

      comment_socket.callback = function (data) {
        that.post_collection.find(function (model) {
          if (model.id == data.post_id) {
            var new_comment_count;
            if (data.type == "comment") {
              new_comment_count = parseInt(model.get("post_comments_count")) + 1;
              model.get("post_comments").push(data.comment);
            } else if (data.type == "uncomment") {
              new_comment_count = parseInt(model.get("post_comments_count")) - 1;
            }

            model.set({
              "post_comments_count": new_comment_count
            });
          }
        });
      }

      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.logs.length; i++) {
            var log = new Log(response.logs[i]);
            that.logs_view.collection.add(log);
          }
        },
        error: function () {

        }
      })


      this.post_collection.fetch({
        data: {page: this.page},
        success: function (model, response, options) {
          for (var i = 0; i < response.posts.length; i++) {
            var post = new Post(response.posts[i]);
            that.posts_view.collection.add(post);
          }

          $(".comment-input").autosize();
        },
        error: function () {

        }
      })

      this.user_collection.fetch({
        data: {page: 1, type: "activity"},
        success: function (model, response, options) {
          for (var i = 0; i < response.users.length; i++) {
            var user = new User(response.users[i]);
            user.strimWidth(30);
            that.users_view.collection.add(user);
          }
        },
        error: function () {

        }
      })


      $(window).bind("scroll", this.pagenation);
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");
        this.page += 1;

        this.post_collection.fetch({
          data: {page: this.page},
          success: function (model, response, options) {
            for (var i = 0; i < response.posts.length; i++) {
              var post = new Post(response.posts[i]);
              that.posts_view.collection.add(post);
            }

            $(".loading-gif").css("display", "none");

            if (response.posts.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    },
    toggleSelectModal: function () {
      if ($(".select-log-list").css("display") == "none") {
        $(".select-log-list").css("display", "block");
      } else {
        $(".select-log-list").css("display", "none");
      }
    },
    selectLog: function (model) {
      var template        = _.template($("#game-thumbnail-template").html());
      template            = template(model.toJSON());
      this.$("ul.thumbnail-list").html("").html(template);
      this.toggleSelectModal();
      this.select_log_id  = model.id;
      this.select_game_id = model.get("game").id;
    },
    post: function (e) {
      e.preventDefault();
      if (this.post_input.val() != "" && this.select_log_id) {
        var that = this;
        var data = {
          "post": {
            "game_id":  this.select_game_id,
            "log_id":   this.select_log_id,
            "text":     this.post_input.val(),
            "files":    this.upload.files,
            "provider": this.provider
          },
          "url_thumbnail": this.url_thumbnail
        }

        data.post.urls = this.getUrl(data.post.text);

        this.post_collection.create(data, {
          method: "POST",
          success: function (response) {
            var post      = new Post(response.get("last_post"));
            post.strimWidth(40).sanitize().sanitizeComment();
            that.posts_view.collection.add(post, {silent: true});
            var post_view = new PostView({model: post});
            that.posts_view.$el.prepend(post_view.render().el);

            var data = {
              type: "post",
              post: response.get("last_post"),
              from_user_id: post_socket.user_id
            }

            post_socket.send(data);

            that.post_input.val("");
            that.$("ul.thumbnail-list").html("");
            that.select_log_id      = null;
            that.select_game_id     = null;
            that.url_thumbnail      = null;
            that.current_access_url = null;
            that.prev_access_url    = null;
            that.upload.files       = [];
            that.provider           = null;
            $("#thumbnail").html("");

            $(".comment-input").autosize();
          },
          error: function () {
          }
        })
      }
    },
    getUrl: function (str) {
      var pat  = /(https?:\/\/[\x21-\x7e]+)/g;
      var list = str.match(pat);

      if (!list) {
        return [];
      }

      return list;
    },
    checkUrl: function () {
      var that     = this;
      var text     = this.post_input.val();
      var url_list = this.getUrl(text);
      if (url_list.length > 0) {
        this.current_access_url = url_list[url_list.length - 1];

        if (this.current_access_url !== this.prev_access_url) {

          if (req) {
            req.abort();
          }

          var req = $.ajax({
            type: "GET",
            url: "/api/post_urls/new?url=" + this.current_access_url,
            data: {},
            success: function (data) {
              that.prev_access_url = that.current_access_url;
              req                  = null;
              that.url_thumbnail   = data.result;
              that.$(".url-thumbnail-list").html(that.url_thumbnail_template(data.result));
            },
            error: function () {

            }
          })
        }
      } else {
        this.$(".url-thumbnail-list").html("");
        that.url_thumbnail = null;
      }
    }
  })

  var app = new AppView();
})();