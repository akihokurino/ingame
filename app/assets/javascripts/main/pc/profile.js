//= require ../../libs/socket.js
//= require ../../models/log.js
//= require ../../models/post.js
//= require ../../models/user.js
//= require ../../collections/logs.js
//= require ../../collections/posts.js
//= require ../../collections/users.js
//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/user_view.js
//= require ../../views/users_view.js

(function () {

  var LogListView = Backbone.View.extend({
    el: ".profile-page",
    events: {
      "keypress .search-log": "search"
    },
    template: _.template($("#log-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".count-box li").removeClass("current");
      this.$(".logs-li").addClass("current");

      var that               = this;
      this.log_collection    = new Logs();
      this.logs_view         = new LogsView({el: ".log-list", collection: this.log_collection, attributes: {type: "select"}});


      this.search_log_title  = this.$(".search-log");
      this.user_id           = this.$el.data("userid");

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
    },
    search: function (e) {
      if (e.which == 13 && this.search_log_title.val() != "") {
        e.preventDefault();

        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");

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
        }

        this.search_log_title.val("");
      }
    }
  })

  var PostListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#post-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".count-box li").removeClass("current");
      this.$(".posts-li").addClass("current");

      _.bindAll(this, "pagenation");

      var that               = this;
      this.post_collection   = new Posts();
      this.posts_view        = new PostsView({el: ".post-list", collection: this.post_collection});

      this.user_id           = this.$el.data("userid");
      this.page              = 1;

      this.post_collection.fetch({
        data: {user_id: this.user_id, type: "user", page: this.page},
        success: function (model, response, options) {
          for (var i = 0; i < response.posts.length; i++) {
            var post = new Post(response.posts[i]);
            that.posts_view.collection.add(post);
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
          data: {user_id: this.user_id, type: "user", page: this.page},
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
    }
  })

  var FollowsListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#follows-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".count-box li").removeClass("current");
      this.$(".follows-li").addClass("current");

       _.bindAll(this, "pagenation");

      var that             = this;
      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".follows-list", collection: this.user_collection});

      this.user_id         = this.$el.data("userid");
      this.page            = 1;

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "follows", page: this.page},
        success: function (model, response, options) {
          for (var i = 0; i < response.users.length; i++) {
            var user = new User(response.users[i]);
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

        this.user_collection.fetch({
          data: {user_id: this.user_id, type: "follows", page: this.page},
          success: function (model, response, options) {
            for (var i = 0; i < response.users.length; i++) {
              var user = new User(response.users[i]);
              that.users_view.collection.add(user);
            }

            $(".loading-gif").css("display", "none");

            if (response.users.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    }
  })

  var FollowersListView = Backbone.View.extend({
    el: ".profile-page",
    template: _.template($("#followers-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);
      this.$(".count-box li").removeClass("current");
      this.$(".followers-li").addClass("current");

       _.bindAll(this, "pagenation");

      var that             = this;
      this.user_collection = new Users();
      this.users_view      = new UsersView({el: ".followers-list", collection: this.user_collection});

      this.user_id         = this.$el.data("userid");
      this.page            = 1;

      this.user_collection.fetch({
        data: {user_id: this.user_id, type: "followers", page: this.page},
        success: function (model, response, options) {
          for (var i = 0; i < response.users.length; i++) {
            var user = new User(response.users[i]);
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

        this.user_collection.fetch({
          data: {user_id: this.user_id, type: "followers", page: this.page},
          success: function (model, response, options) {
            for (var i = 0; i < response.users.length; i++) {
              var user = new User(response.users[i]);
              that.users_view.collection.add(user);
            }

            $(".loading-gif").css("display", "none");

            if (response.users.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    }
  })


  var AppView = Backbone.View.extend({
    el: ".profile-page",
    events: {
      "click .follow-btn":   "follow",
      "click .unfollow-btn": "unfollow"
    },
    initialize: function () {
      this.follow_btn_template   = _.template($("#follow-btn-template").html());
      this.unfollow_btn_template = _.template($("#unfollow-btn-template").html());
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
    }
  })


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