//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/user_view.js
//= require ../../views/users_view.js


(function () {
  var LogListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#log-list-template").html()),
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");

      this.setCurrentTab();

      this.tmp_log_list         = [];
      this.user_id              = this.$el.data("userid");
      this.type                 = null;
      this.current_search_title = null;
      this.already_customised   = false;

      if (this.attributes && this.attributes.type) {
        this.type = this.attributes.type;
      }

      if (this.attributes && this.attributes.search_title) {
        this.current_search_title = this.attributes.search_title;
      }

      this.getCurrentLogListOrder();
    },
    getCurrentLogListOrder: function () {
      var that = this;
      $.ajax({
        type: "GET",
        url: "/api/user_log_orders/" + this.user_id,
        data: {},
        success: function (data) {
          that.$(".profile-timeline").append(that.template({"log_order": data.log_order.split(",")}));
          that.log_collection     = new Logs();
          that.logs_view          = new LogsView({el: ".log-list", collection: that.log_collection, attributes: {type: "select", template: "#log-template"}});
          that.already_customised = data.already_customised;

          that.getUserlog();

          if (that.user_id == $("#wrapper").data("userid")) {
            that.$el.find(".log-list").sortable({
              handle: ".drag-header",
              opacity: 0.5,
              update: function (event, ui) {
                var update_log_list = that.$el.find(".log-list").sortable("toArray").join(",");
                that.updateLogListOrder(update_log_list);
              }
            });
          }
        },
        error: function () {

        }
      });
    },
    updateLogListOrder: function (order) {
      var that = this;
      var data = {
        "user_log_order": {
          "order": order
        }
      }

      if (this.already_customised) {
        $.ajax({
          type: "PUT",
          url: "/api/user_log_orders/" + this.user_id,
          data: data,
          success: function (data) {
            that.already_customised = data.already_customised;
          },
          error: function () {

          }
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/api/user_log_orders",
          data: data,
          success: function (data) {
            that.already_customised = data.already_customised;
          },
          error: function () {

          }
        });
      }
    },
    getUserlog: function () {
      var that = this;
      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          if (response.logs && response.logs.length > 0) {
            for (var i = 0; i < response.logs.length; i++) {
              var log = new Log(response.logs[i]);
              log.set("url", "/games/" + log.get("game").id + "#all");
              that.logs_view.settingModel(log);
              that.logs_view.collection.add(log);
              that.tmp_log_list.push(log);
            }
          }

          if (that.type == "search") {
            that.search(that.current_search_title);
          }
        },
        error: function () {

        }
      });
    },
    search: function (text) {
      this.logs_view.collection.reset();
      this.logs_view.removeEachLogs();

      var keyword = new RegExp(text, "i");

      for (var i = 0; i < this.tmp_log_list.length; i++) {
        var log = this.tmp_log_list[i];
        if (log.get("game").title.match(keyword)) {
          this.logs_view.collection.add(log);
        }
      }
    },
    setCurrentTab: function () {
      this.$(".count-box li").removeClass("current");
      this.$(".logs-li").addClass("current");
    }
  });

  var PostListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#post-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.user_id         = this.$el.data("userid");

      this.posts_view.render({user_id: this.user_id, type: "user", page: 1});
    },
    setCurrentTab: function () {
      this.$(".count-box li").removeClass("current");
      this.$(".posts-li").addClass("current");
    }
  });

  var FollowsListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#follows-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      this.setCurrentTab();

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".follows-list", collection: this.user_collection, attributes: {type: "follows-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");

      this.users_view.render({user_id: this.user_id, type: "follows", page: 1});
    },
    setCurrentTab: function () {
      this.$(".count-box li").removeClass("current");
      this.$(".follows-li").addClass("current");
    }
  });

  var FollowersListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#followers-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      this.setCurrentTab();

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".followers-list", collection: this.user_collection, attributes: {type: "followers-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");

      this.users_view.render({user_id: this.user_id, type: "followers", page: 1});
    },
    setCurrentTab: function () {
      this.$(".count-box li").removeClass("current");
      this.$(".followers-li").addClass("current");
    }
  });


  var AppView = Backbone.View.extend({
    el: ".profile-page",
    events: {
      "click .main-follow-btn":   "follow",
      "click .main-unfollow-btn": "unfollow",
      "keypress .search-log":     "search"
    },
    follow_btn_template: _.template($("#main-follow-btn-template").html()),
    unfollow_btn_template: _.template($("#main-unfollow-btn-template").html()),
    initialize: function () {
      this.search_log_title = this.$(".search-log");
      this.user_id          = this.$el.data("userid");
    },
    follow: function () {
      var that = this;
      var data = {
        "follow": {
          "to_user_id": this.user_id
        }
      }

      $.ajax({
        type: "POST",
        url: "/api/follows",
        data: data,
        success: function (data) {
          if (data.result) {
            that.$el.find(".follow-wrap").html("");
            that.$el.find(".follow-wrap").append(that.unfollow_btn_template);
          }
        },
        error: function () {

        }
      })
    },
    unfollow: function () {
      var that = this;
      $.ajax({
        "type": "DELETE",
        url: "/api/follows/" + this.user_id,
        data: {},
        success: function (data) {
          if (data.result) {
            that.$el.find(".follow-wrap").html("");
            that.$el.find(".follow-wrap").append(that.follow_btn_template);
          }
        },
        error: function () {

        }
      })
    },
    search: function (e) {
      if (e.which == 13 && this.search_log_title.val() != "") {
        e.preventDefault();

        router.current_list = new LogListView({attributes: {type: "search", search_title: this.search_log_title.val()}});
      }
    }
  });


  /* ---------- Router ---------- */
  var Router = Backbone.Router.extend({
    routes: {
      "logs":      "logs",
      "posts":     "posts",
      "follows":   "follows",
      "followers": "followers"
    },
    logs: function () {
      this.current_list = new LogListView();
    },
    posts: function () {
      this.current_list = new PostListView();
    },
    follows: function () {
      this.current_list = new FollowsListView();
    },
    followers: function () {
      this.current_list = new FollowersListView();
    }
  });

  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();