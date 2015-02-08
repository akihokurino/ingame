//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/user_view.js
//= require ../../views/users_view.js
//= require ../../views/comment_view.js
//= require ../../views/comments_view.js
//= require ../../views/comment_modal_view.js


(function () {
  var LogListView = Backbone.View.extend({
    el: ".profile-page",
    events: {
      "click .playing-tab":   "setPlaying",
      "click .ready-tab":     "setAttention",
      "click .played-tab":    "setArchive",
      "click .stock-tab":     "setStock",
      "keypress .search-log": "search"
    },
    template: _.template($("#log-list-template").html()),
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);

      this.setCurrentTab();

      this.log_collection   = new Logs();
      this.logs_view        = new LogsView({el: ".log-list", collection: this.log_collection, attributes: {template: "#log-template"}});

      this.attentions       = [];
      this.playings         = [];
      this.archives         = [];
      this.stocks           = [];

      this.search_log_title = this.$(".search-log");
      this.current_tab      = null;
      this.user_id          = this.$el.data("userid");

      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.logs.length; i++) {
            var log = new Log(response.logs[i]);
            log.set("current_url", "/games/" + log.get("game").id + "#all");
            switch (log.get("status").id) {
              case 1:
                that.attentions.push(log);
                that.logs_view.collection.add(log);
                that.current_tab = 1
                break;
              case 2:
                that.playings.push(log);
                break;
              case 3:
                that.archives.push(log);
                break;
              case 4:
                that.stocks.push(log);
                break;
            }
          }
        },
        error: function () {

        }
      });
    },
    setAttention: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sort-box li").removeClass("current");
      for (var i = 0; i < this.attentions.length; i++) {
        this.logs_view.collection.add(this.attentions[i]);
      }
      this.$el.find("ul.sort-box li.ready-li").addClass("current");
      this.current_tab = 1
    },
    setPlaying: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sort-box li").removeClass("current");
      for (var i = 0; i < this.playings.length; i++) {
        this.logs_view.collection.add(this.playings[i]);
      }
      this.$el.find("ul.sort-box li.playing-li").addClass("current");
      this.current_tab = 2
    },
    setArchive: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sort-box li").removeClass("current");
      for (var i = 0; i < this.archives.length; i++) {
        this.logs_view.collection.add(this.archives[i]);
      }
      this.$el.find("ul.sort-box li.played-li").addClass("current");
      this.current_tab = 3
    },
    setStock: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sort-box li").removeClass("current");
      for (var i = 0; i < this.stocks.length; i++) {
        this.logs_view.collection.add(this.stocks[i]);
      }
      this.$el.find("ul.sort-box li.stock-li").addClass("current");
      this.current_tab = 4
    },
    search: function (e) {
      if (e.which == 13 && this.search_log_title.val() != "") {
        e.preventDefault();

        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sort-box li").removeClass("current");

        var keyword = new RegExp(this.search_log_title.val(), "i");

        switch (this.current_tab) {
          case 1:
            for (var i = 0; i < this.attentions.length; i++) {
              var log = this.attentions[i]
              if (log.get("game").title.match(keyword)) {
                this.logs_view.collection.add(log);
              }
            }
            break;
          case 2:
            for (var i = 0; i < this.playings.length; i++) {
              var log = this.playings[i]
              if (log.get("game").title.match(keyword)) {
                this.logs_view.collection.add(log);
              }
            }
            break;
          case 3:
            for (var i = 0; i < this.archives.length; i++) {
              var log = this.archives[i]
              if (log.get("game").title.match(keyword)) {
                this.logs_view.collection.add(log);
              }
            }
            break;
          case 4:
            for (var i = 0; i < this.stocks.length; i++) {
              var log = this.stocks[i]
              if (log.get("game").title.match(keyword)) {
                this.logs_view.collection.add(log);
              }
            }
            break;
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
    events: {

    },
    template: _.template($("#post-list-template").html()),
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);

      this.setCurrentTab();

      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.user_id            = this.$el.data("userid");

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
      var that = this;

      $(window).unbind("scroll");
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);

      this.setCurrentTab();

      _.bindAll(this, "setUserCollection");

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".follows-list", collection: this.user_collection, attributes: {type: "follows-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");

      this.pagenation      = new Pagenation(this.user_collection, {user_id: this.user_id, type: "follows"}, this.setUserCollection);

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "follows", page: 1},
        success: function (model, response, options) {
          that.setUserCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setUserCollection: function (model, response, option) {
      for (var i = 0; i < response.users.length; i++) {
        var user = new User(response.users[i]);
        this.users_view.collection.add(user);
      }

      if (response.users.length != 0) {
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

      this.setCurrentTab();

      _.bindAll(this, "setUserCollection");

      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".followers-list", collection: this.user_collection, attributes: {type: "followers-list", template: "#user-template"}});

      this.user_id         = this.$el.data("userid");

      this.pagenation      = new Pagenation(this.user_collection, {user_id: this.user_id, type: "followers"}, this.setUserCollection);

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "followers", page: 1},
        success: function (model, response, options) {
          that.setUserCollection(model, response, options);
        },
        error: function () {
        }
      });
    },
    setUserCollection: function (model, response, option) {
      for (var i = 0; i < response.users.length; i++) {
        var user = new User(response.users[i]);
        this.users_view.collection.add(user);
      }

      if (response.users.length != 0) {
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
      "click .main-unfollow-btn": "unfollow"
    },
    initialize: function () {
      this.follow_btn_template   = _.template($("#main-follow-btn-template").html());
      this.unfollow_btn_template = _.template($("#main-unfollow-btn-template").html());
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
      });
    }
  });


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