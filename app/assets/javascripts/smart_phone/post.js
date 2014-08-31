//= require ../models/log.js
//= require ../models/game.js
//= require ../models/result.js
//= require ../collections/logs.js
//= require ../collections/results.js
//= require ../libs/post_upload.js

(function () {
  $(function () {
    var user_id = $(".post-new-page").data("userid");

    /* ---------- Collection ---------- */
    var logs = new Logs();
    var results = new Results();



    /* ---------- View ---------- */
    var LogsView = Backbone.View.extend({
      initialize: function () {
        this.collection = logs;
        this.listenTo(this.collection, "add", this.addLog);
      },
      addLog: function (log) {
        if(log.id){
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
        this.collection = results;
        this.listenTo(this.collection, "add", this.addResult);
      },
      addResult: function (result) {
        if(result.id){
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
        var that = this;

        this.$el.html("");
        this.$el.html(this.template);

        this.logs_view = new LogsView({el: ".gameList"});
        this.$el.find(".select-page").append(this.logs_view.el);

        this.attentions = [];
        this.playings = [];
        this.archives = [];

        this.logs_view.collection.reset();

        $.ajax({
          type: "GET",
          url: "/api/logs?user_id=" + user_id,
          data: {},
          success: function (data) {
            for(var i = 0; i < data.logs.length; i++){
              var log = new Log(data.logs[i]);
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
            console.log("error");
          }
        })
      },
      setPlaying: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.playings.length; i++){
          this.logs_view.collection.add(this.playings[i]);
        }
        this.$el.find("ul.sortBox li.playing-li").addClass("current");
      },
      setAttention: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.attentions.length; i++){
          this.logs_view.collection.add(this.attentions[i]);
        }
        this.$el.find("ul.sortBox li.ready-li").addClass("current");
      },
      setArchive: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.archives.length; i++){
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
        var that = this;

        this.$el.html("");
        this.$el.append(this.template);

        var url_array = location.href.split("/");
        this.log_id = url_array.pop();
        this.game_id = url_array.pop();
        this.text = $("textarea");

        this.upload = new PostUpload("upload-btn", "thumbnail");

        $.ajax({
          type: "GET",
          url: "/api/games/" + this.game_id,
          data: {},
          success: function (data) {
            var game = new Game(data.game);
            var game_view = new GameView({model: game});
            that.$el.find(".write-page").prepend(game_view.render().el);
          },
          error: function () {
            console.log("error");
          }
        })
      },
      post: function (e) {
        e.preventDefault();

        var data = {
          "post": {
            "game_id": this.game_id,
            "log_id": this.log_id,
            "text": this.text.val(),
            "files": this.upload.files
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
            console.log("error");
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
        var that = this;

        this.$el.html("");
        this.$el.append(this.template);

        this.results_view = new ResultsView({el: ".gameList"});
        this.$el.find(".add-page").append(this.results_view.el);

        this.collection = results;

        this.search_title = this.$(".search-title-input");
        this.current_search_title = null;

        this.page = 1;
      },
      search: function (e) {
        e.preventDefault();
        var that = this;
        this.current_search_title = this.search_title.val();
        this.collection.fetch({
          data: {search_title: this.current_search_title, page: this.page},
          success: function (model, response, options) {
            that.collection.reset();
            that.results_view.$el.html("");
            if(response.results && response.results.length > 0){
              for(var i = 0; i < response.results.length; i++){
                var result = new Result(response.results[i]);
                that.collection.add(result);
              }
            }

            $(window).bind("scroll", pagenation);
          },
          error: function () {
            console.log("error");
          }
        })
      }
    })

    function pagenation(){
      var scrollHeight = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");

        var app = router.current_app;
        app.page += 1;

        app.collection.fetch({
          data: {search_title: app.current_search_title, page: app.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var result = new Result(response.results[i]);
                app.collection.add(result);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", pagenation);
            }
          },
          error: function () {
            console.log("error");
          }
        })
      }
    }


    var Router = Backbone.Router.extend({
      routes: {
        "select": "select",
        "write/:game_id/:log_id": "write",
        "add": "add"
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