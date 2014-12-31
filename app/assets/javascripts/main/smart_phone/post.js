//= require ../../libs/socket.js
//= require ../../models/log.js
//= require ../../models/game.js
//= require ../../models/game_result.js
//= require ../../collections/logs.js
//= require ../../collections/game_results.js
//= require ../../views/log_view.js
//= require ../../views/logs_view.js
//= require ../../views/game_view.js
//= require ../../views/game_result_view.js
//= require ../../views/game_results_view.js
//= require ../../libs/post_upload.js

(function () {
  var SelectView = Backbone.View.extend({
    el: $(".post-new-page"),
    events: {
      "click .playing": "setPlaying",
      "click .ready": "setAttention",
      "click .played": "setArchive"
    },
    template: _.template($("#select-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.html(this.template);

      var that            = this;

      this.log_collection = new Logs();
      this.logs_view      = new LogsView({el: ".gameList", collection: this.log_collection, attributes: {template: "#log-template"}});
      this.$el.find(".select-page").append(this.logs_view.el);

      this.attentions     = [];
      this.playings       = [];
      this.archives       = [];

      this.user_id        = $(".post-new-page").data("userid");

      this.logs_view.collection.reset();

      this.log_collection.fetch({
        data: {user_id: this.user_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.logs.length; i++) {
            var log         = new Log(response.logs[i]);
            var current_url = "/posts/new#write/" + log.get("game").id + "/" + log.id;
            log.set("current_url", current_url);
            switch(log.get("status").id){
              case 1:
                that.attentions.push(log);
                that.logs_view.collection.add(log);
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
    setPlaying: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.playings.length; i++) {
        this.logs_view.collection.add(this.playings[i]);
      }
      this.$el.find("ul.sortBox li.playing-li").addClass("current");
    },
    setAttention: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.attentions.length; i++) {
        this.logs_view.collection.add(this.attentions[i]);
      }
      this.$el.find("ul.sortBox li.ready-li").addClass("current");
    },
    setArchive: function () {
      this.logs_view.collection.reset();
      this.logs_view.removeLogs();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.archives.length; i++) {
        this.logs_view.collection.add(this.archives[i]);
      }
      this.$el.find("ul.sortBox li.played-li").addClass("current");
    }
  })

  var WriteView = Backbone.View.extend({
    el: $(".post-new-page"),
    template: _.template($("#write-template").html()),
    events: {
      "click .submit":     "post",
      "click .facebook":   "facebook",
      "click .twitter":    "twitter",
      "keyup .post-input": "checkUrl"
    },
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      var that      = this;
      var tmp       = location.href.split("/");
      this.log_id   = tmp.pop();
      this.game_id  = tmp.pop();
      this.text     = this.$(".post-input");
      this.provider = null;

      this.upload   = new PostUpload("upload-btn", "thumbnail");

      this.current_access_url     = null;
      this.prev_access_url        = null;

      this.url_thumbnail          = null;
      this.url_thumbnail_template = _.template($("#url-thumbnail-template").html());

      $(".post-input").autosize();

      $.ajax({
        type: "GET",
        url: "/api/games/" + this.game_id,
        data: {},
        success: function (data) {
          var game      = new Game(data.game);
          game.strimWidth(40);
          var game_view = new GameView({model: game});
          that.$el.find(".write-page").prepend(game_view.render().el);
        },
        error: function () {

        }
      })
    },
    facebook: function (e) {
      e.preventDefault();
      this.provider = "facebook";
    },
    twitter: function (e) {
      e.preventDefault();
      this.provider = "twitter";
    },
    post: function (e) {
      e.preventDefault();

      var that = this;

      var data = {
        "post": {
          "game_id":  this.game_id,
          "log_id":   this.log_id,
          "text":     this.text.val(),
          "files":    this.upload.files,
          "provider": this.provider
        },
        "url_thumbnail": this.url_thumbnail,
      }

      data.post.urls = this.getUrl(data.post.text);

      $.ajax({
        type: "POST",
        url: "/api/posts",
        data: data,
        success: function (data) {
          var data = {
            type: "post",
            post: data.last_post,
            from_user_id: post_socket.user_id
          }

          post_socket.send(data);

          that.resetInput();

          location.href = "/posts";
        },
        error: function () {

        }
      })
    },
    resetInput: function () {
      this.upload.files  = [];
      this.url_thumbnail = null;
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
      var text     = this.text.val();
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


  var AddView = Backbone.View.extend({
    el: $(".post-new-page"),
    events: {
      "submit": "searchWithEnter"
    },
    template: _.template($("#add-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      var that                    = this;
      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".gameList", collection: this.game_result_collection});

      this.search_title           = this.$(".search-title-input");
      this.current_search_title   = null;
      this.page                   = 1;

      if (this.getQueryString()) {
        this.current_search_title = this.getQueryString().search_word;
        this.search_title.val(this.current_search_title);
        this.search();
      }
    },
    search: function () {
      var that                  = this;
      this.current_search_title = this.search_title.val();

      this.game_result_collection.fetch({
        data: {search_title: this.current_search_title, page: this.page},
        success: function (model, response, options) {
          that.game_result_collection.reset();
          that.game_results_view.$el.html("");
          if (response.results && response.results.length > 0) {
            for (var i = 0; i < response.results.length; i++) {
              var game_result = new GameResult(response.results[i]);
              that.game_results_view.collection.add(game_result);
            }
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

        this.game_result_collection.fetch({
          data: {search_title: this.current_search_title, page: this.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var game_result = new GameResult(response.results[i]);
                that.game_results_view.collection.add(game_result);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    },
    searchWithEnter: function (e) {
      e.preventDefault();
      if (this.search_title.val() != "") {
        this.current_search_title = this.search_title.val();
        this.insertParam("search_word", this.current_search_title);
      }
    },
    getQueryString: function () {
      if (1 < document.location.search.length) {
        var query      = document.location.search.substring(1);
        var parameters = query.split('&');
        var result     = new Object();

        for (var i = 0; i < parameters.length; i++) {
          var element       = parameters[i].split('=');
          var paramName     = decodeURIComponent(element[0]);
          var paramValue    = decodeURIComponent(element[1]);
          result[paramName] = decodeURIComponent(paramValue);
        }
        return result;
      }
      return null;
    },
    insertParam: function (key, value) {
      var kvp = document.location.search.substr(1).split('&');
      var i   = kvp.length;
      var x;
      while (i--) {
        x = kvp[i].split('=');

        if (x[0] == key) {
          x[1]   = value;
          kvp[i] = x.join('=');
          break;
        }
      }

      if (i<0) {
        kvp[kvp.length] = [key,value].join('=');
      }
      document.location.search = kvp.join('&');
    }
  })


  var Router = Backbone.Router.extend({
    routes: {
      "select":                 "select",
      "write/:game_id/:log_id": "write",
      "add":                    "add"
    },
    select: function () {
      this.current_app = new SelectView();
    },
    write: function () {
      this.current_app = new WriteView();
    },
    add: function () {
      this.current_app = new AddView();
    }
  })

  var router = new Router();
  Backbone.history.start();
})();