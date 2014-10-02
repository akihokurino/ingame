//= require ../../models/log.js
//= require ../../models/game.js
//= require ../../models/result.js
//= require ../../collections/logs.js
//= require ../../collections/results.js
//= require ../../libs/post_upload.js

(function () {
  $(function () {

    /* ---------- View ---------- */

    var LogsView = Backbone.View.extend({
      initialize: function () {
        this.listenTo(this.collection, "add", this.addLog);
      },
      addLog: function (log) {
        if (log.id) {
          log.strimWidth(70);
          var log_view = new LogView({model: log});
          this.$el.prepend(log_view.render().el);
        }
      },
      removeLogs: function () {
        this.$el.html("");
      }
    })

    var LogView = Backbone.View.extend({
      tagName: "li",
      className: "item",
      events: {

      },
      initialize: function () {

      },
      template: _.template($("#log-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);

        return this;
      }
    })

    var GameView = Backbone.View.extend({
      tagName: "div",
      className: "gameBox",
      template: _.template($("#game-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);

        return this;
      }
    })

    var ResultsView = Backbone.View.extend({
      initialize: function () {
        this.listenTo(this.collection, "add", this.addResult);
      },
      addResult: function (result) {
        if (result.id) {
          result.strimWidth(30);
          var result_view = new ResultView({model: result});
          this.$el.prepend(result_view.render().el);
        }
      }
    })

    var ResultView = Backbone.View.extend({
      tagName: "li",
      className: "item",
      events: {
        "change .status": "regist"
      },
      initialize: function () {

      },
      remove: function () {
        this.$el.remove();
      },
      template: _.template($("#result-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);

        return this;
      },
      regist: function () {
        if (this.$el.find("select").val() != ""){
          var that = this;

          var data = {
            "log": {
              "game_id": this.model.id,
              "status_id": this.$el.find("select").val()
            }
          }

          $.ajax({
            type: "POST",
            url: "/api/logs",
            data: data,
            success: function (data) {
              that.remove();
            },
            error: function () {
              console.log("error");
            }
          })
          }
        }
    })

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
        this.logs_view      = new LogsView({el: ".gameList", collection: this.log_collection});
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
              var log = new Log(response.logs[i]);
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
        "click .submit": "post"
      },
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);

        var that      = this;
        var tmp       = location.href.split("/");
        this.log_id   = tmp.pop();
        this.game_id  = tmp.pop();
        this.text     = $("textarea");

        this.upload   = new PostUpload("upload-btn", "thumbnail");

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
      post: function (e) {
        e.preventDefault();

        var data = {
          "post": {
            "game_id": this.game_id,
            "log_id":  this.log_id,
            "text":    this.text.val(),
            "files":   this.upload.files
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/posts",
          data: data,
          success: function (data) {
            location.href = "/posts";
          },
          error: function () {

          }
        })
      }
    })


    var AddView = Backbone.View.extend({
      el: $(".post-new-page"),
      events: {
        "submit": "search"
      },
      template: _.template($("#add-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);

        _.bindAll(this, "pagenation");

        var that                  = this;
        this.result_collection    = new Results();
        this.results_view         = new ResultsView({el: ".gameList", collection: this.result_collection});

        this.search_title         = this.$(".search-title-input");
        this.current_search_title = null;
        this.page                 = 1;
      },
      search: function (e) {
        e.preventDefault();
        if (this.search_title.val()) {
          var that                  = this;
          this.current_search_title = this.search_title.val();

          this.result_collection.fetch({
            data: {search_title: this.current_search_title, page: this.page},
            success: function (model, response, options) {
              that.result_collection.reset();
              that.results_view.$el.html("");
              if (response.results && response.results.length > 0) {
                for (var i = 0; i < response.results.length; i++) {
                  var result = new Result(response.results[i]);
                  that.results_view.collection.add(result);
                }
              }
            },
            error: function () {

            }
          })

          $(window).bind("scroll", this.pagenation);
        }
      },
      pagenation: function () {
        var that           = this;
        var scrollHeight   = $(document).height();
        var scrollPosition = $(window).height() + $(window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
          $(".loading-gif").css("display", "block");
          $(window).unbind("scroll");

          this.page += 1;

          this.result_collection.fetch({
            data: {search_title: this.current_search_title, page: this.page},
            success: function (model, response, options) {
              if (response.results && response.results.length > 0) {
                for (var i = 0; i < response.results.length; i++) {
                  var result = new Result(response.results[i]);
                  that.results_view.collection.add(result);
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
  })
})();