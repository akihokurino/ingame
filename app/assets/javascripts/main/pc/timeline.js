//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/user_view.js
//= require ../../views/users_view.js
//= require ../../views/game_view.js
//= require ../../views/games_view.js


(function () {
  var AppView = Backbone.View.extend({
    el: ".timeline-page",
    events: {
      "click .show-select-modal": "toggleSelectModal",
      "click .post-btn":          "post",
      "keyup .post-input":        "checkUrl",
      "click .twitter-btn":       "shareTwitter",
      "click .facebook-btn":      "shareFacebook"
    },
    game_thumbnail_template: _.template($("#game-thumbnail-template").html()),
    initialize: function () {
      var that = this;

      _.bindAll(this, "selectLog");

      this.post_collection        = new Posts();
      this.posts_view             = new PostsView({collection: this.post_collection});
      this.log_collection         = new Logs();
      this.logs_view              = new LogsView({el: ".select-log-list", collection: this.log_collection, attributes: {type: "select", template: "#log-option-template"}});
      this.user_collection        = new Users();
      this.users_view             = new UsersView({el: ".user-activity-list", collection: this.user_collection, attributes: {type: "activity", template: "#user-activity-template"}});
      this.game_collection        = new Games();
      this.games_view             = new GamesView({el: ".game-activity-list", collection: this.game_collection, attributes: {type: "activity", template: "#game-activity-template"}});

      this.post_input             = this.$(".post-input");
      this.select_log_id          = null;
      this.select_game_id         = null;
      this.user_id                = $("#wrapper").data("userid");
      this.current_access_url     = null;
      this.prev_access_url        = null;
      this.url_thumbnail          = null;
      this.url_thumbnail_template = _.template($("#url-thumbnail-template").html());

      this.facebook_btn           = $(".facebook-btn");
      this.twitter_btn            = $(".twitter-btn");
      this.post_facebook          = false;
      this.post_twitter           = false;

      event_handle.discribe("selectLog", this.selectLog);

      $(".post-input").autosize();

      this.upload       = new PostUpload("upload-btn", "thumbnail");
      this.tooltip_view = new TooltipView();

      this.logs_view.renderAll({user_id: this.user_id});

      this.users_view.renderAll({page: 1, type: "activity"});

      this.games_view.renderAll({type: "activity"});

      this.posts_view.render({page: 1});
    },
    toggleSelectModal: function () {
      if ($(".select-log-list").css("display") == "none") {
        this.tooltip_view.show(".select-log-list");
      } else {
        this.tooltip_view.hide();
      }
    },
    selectLog: function (model) {
      var template = this.game_thumbnail_template(model.toJSON());
      this.$("ul.thumbnail-list").html(template);
      this.$(".show-select-modal").text(model.get("game").title);
      this.$el.find(".select-log-error").css("display", "none");
      this.toggleSelectModal();
      this.select_log_id  = model.id;
      this.select_game_id = model.get("game").id;
    },
    post: function (e) {
      e.preventDefault();
      if (this.validate()) {

        $(".loading-post").css("display", "inline-block");

        var that = this;
        var data = {
          "post": {
            "game_id":       this.select_game_id,
            "log_id":        this.select_log_id,
            "text":          this.post_input.val(),
            "files":         this.upload.files,
            "post_facebook": this.post_facebook,
            "post_twitter":  this.post_twitter
          },
          "url_thumbnail": this.url_thumbnail,
        }

        data.post.urls = this.getUrl(data.post.text);

        setTimeout(function () {
          that.post_collection.create(data, {
            method: "POST",
            success: function (response) {
              $(".loading-post").css("display", "none");

              if (response.get("error")) {
                switch (response.get("error").type) {
                  case "photo":
                    that.resetFile();
                    break;
                }
                $(".error-message").html(response.get("error").message);
              } else {
                var post = new Post(response.get("last_post"));
                that.posts_view.settingModel(post);
                that.posts_view.collection.add(post, {silent: true});

                var post_view = new PostView({model: post});
                that.posts_view.$el.prepend(post_view.render().el);

                var data = {
                  type: "post",
                  post: response.get("last_post"),
                  from_user_id: post_socket.user_id
                }

                post_socket.send(data);

                that.resetInput();

                $(".comment-input").autosize();
              }
            },
            error: function () {

            }
          });
        }, 1000);
      }
    },
    validate: function () {
      this.$el.find(".error-log").css("display", "none").html("");
      var error = {};

      if (this.post_input.val() == "") {
        error.post_text = "empty";
      }
      if (!this.select_log_id) {
        error.select_log = "empty";
      }

      if (Object.keys(error).length > 0) {
        for (key in error) {
          switch (key) {
            case "select_log":
              if (error[key] == "empty") {
                this.$el.find(".select-log-error").css("display", "block").html("ゲームを選択して下さい。");
              }
              break;
          }
        }

        return false;
      }

      return true;
    },
    resetInput: function () {
      this.post_input.val("");
      this.$("ul.thumbnail-list").html("");
      this.select_log_id      = null;
      this.select_game_id     = null;
      this.url_thumbnail      = null;
      this.current_access_url = null;
      this.prev_access_url    = null;
      this.upload.files       = [];

      this.post_facebook      = false;
      this.post_twitter       = false;
      this.facebook_btn.removeClass('fbActive');
      this.twitter_btn.removeClass('twActive');

      $("#thumbnail").html("");
      this.$(".url-thumbnail-list").html("");
      $(".error-message").html("");
      $(".show-select-modal").text("ゲームを選ぶ");
    },
    resetFile: function () {
      this.upload.files = [];
      $("#thumbnail").html("");
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
    },
    shareFacebook: function (e) {
      if ($(e.target).hasClass("fbActive")) {
        $(e.target).removeClass('fbActive');

        this.post_facebook = false;
      } else {
        $(e.target).addClass('fbActive');

        this.post_facebook = true;
      }
    },
    shareTwitter: function (e) {
      if ($(e.target).hasClass("twActive")) {
        $(e.target).removeClass('twActive');

        this.post_twitter = false;
      } else {
        $(e.target).addClass('twActive');

        this.post_twitter = true;
      }
    }
  });

  var app = new AppView();
})();
