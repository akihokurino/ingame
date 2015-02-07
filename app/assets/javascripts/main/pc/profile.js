//= require ../../libs/socket.js
//= require ../../libs/pagenation.js
//= require ../../models/log.js
//= require ../../models/post.js
//= require ../../models/user.js
//= require ../../collections/logs.js
//= require ../../collections/posts.js
//= require ../../collections/users.js
//= require ../../views/custom_modal_view.js
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
      this.$(".profile-timeline").append(this.template);

      this.setCurrentTab();

      this.log_collection       = new Logs();
      this.logs_view            = new LogsView({el: ".log-list", collection: this.log_collection, attributes: {type: "select", template: "#log-template"}});

      this.tmp_log_list         = [];
      this.user_id              = this.$el.data("userid");
      this.type                 = null;
      this.current_search_title = null;

      if (this.attributes && this.attributes.type) {
        this.type = this.attributes.type;
      }

      if (this.attributes && this.attributes.search_title) {
        this.current_search_title = this.attributes.search_title;
      }

      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          if (response.logs && response.logs.length > 0) {
            for (var i = 0; i < response.logs.length; i++) {
              var log = new Log(response.logs[i]);
              log.set("url", "/games/" + log.get("game").id + "#all");
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
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      this.setCurrentTab();

      _.bindAll(this, "setPostCollection");

      this.post_collection   = new Posts();
      this.posts_view        = new PostsView({el: ".post-list", collection: this.post_collection});

      this.user_id           = this.$el.data("userid");
      this.page              = 1;

      this.pagenation 　　　　= new Pagenation(this.post_collection, {user_id: this.user_id, type: "user"}, this.setPostCollection);

      this.post_collection.fetch({
        data: {user_id: this.user_id, type: "user", page: this.page},
        success: function (model, response, options) {
          that.setPostCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setPostCollection: function (model, response, option) {
      if (response.posts && response.posts.length > 0) {
        for (var i = 0; i < response.posts.length; i++) {
          var post = new Post(response.posts[i]);
          this.posts_view.collection.add(post);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
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
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      _.bindAll(this, "setUserCollection");

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".follows-list", collection: this.user_collection, attributes: {type: "follows-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");
      this.page            = 1;

      this.pagenation      = new Pagenation(this.user_collection, {user_id: this.user_id, type: "follows"}, this.setUserCollection);

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "follows", page: this.page},
        success: function (model, response, options) {
          that.setUserCollection(model, response, options);
        },
        error: function () {
        }
      });
    },
    setUserCollection: function (model, response, option) {
      if (response.users && response.users.length > 0) {
        for (var i = 0; i < response.users.length; i++) {
          var user = new User(response.users[i]);
          this.users_view.collection.add(user);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
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
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".search-log").val("");

      _.bindAll(this, "setUserCollection");

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".followers-list", collection: this.user_collection, attributes: {type: "followers-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");
      this.page            = 1;

      this.pagenation      = new Pagenation(this.user_collection, {user_id: this.user_id, type: "followers"}, this.setUserCollection);

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "followers", page: this.page},
        success: function (model, response, options) {
          that.setUserCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setUserCollection: function (model, response, option) {
      if (response.users && response.users.length > 0) {
        for (var i = 0; i < response.users.length; i++) {
          var user = new User(response.users[i]);
          this.users_view.collection.add(user);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
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
      this.search_log_title      = this.$(".search-log");
      this.user_id               = this.$el.data("userid");
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
  })

  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();