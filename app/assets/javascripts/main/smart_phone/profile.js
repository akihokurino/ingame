//= require ../../models/log.js
//= require ../../collections/logs.js
//= require ../../views/log_view.js
//= require ../../views/logs_view.js

(function () {

  var LogListView = Backbone.View.extend({
    el: ".profile-page",
    events: {
      "click .playing":       "setPlaying",
      "click .ready":         "setAttention",
      "click .played":        "setArchive",
      "keypress .search-log": "search"
    },
    template: _.template($("#log-list-template").html()),
    initialize: function () {
      this.$(".profile-timeline").html("");
      this.$(".profile-timeline").append(this.template);

      var that               = this;
      this.log_collection    = new Logs();
      this.logs_view         = new LogsView({el: ".log-list", collection: this.log_collection});

      this.attentions        = [];
      this.playings          = [];
      this.archives          = [];

      this.search_log_title  = this.$(".search-log");
      this.current_tab       = null;
      this.user_id           = this.$el.data("userid");

      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.logs.length; i++) {
            var log = new Log(response.logs[i]);
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
            }
          }
        },
        error: function () {

        }
      })
    },
    setAttention: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.attentions.length; i++) {
        this.logs_view.collection.add(this.attentions[i]);
      }
      this.$el.find("ul.sortBox li.ready-li").addClass("current");
      this.current_tab = 1
    },
    setPlaying: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.playings.length; i++) {
        this.logs_view.collection.add(this.playings[i]);
      }
      this.$el.find("ul.sortBox li.playing-li").addClass("current");
      this.current_tab = 2
    },
    setArchive: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.archives.length; i++) {
        this.logs_view.collection.add(this.archives[i]);
      }
      this.$el.find("ul.sortBox li.played-li").addClass("current");
      this.current_tab = 3
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
    initialize: function () {

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

    },
    followers: function () {

    }
  })

  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();