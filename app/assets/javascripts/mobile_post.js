(function () {
  $(function () {
    var user_id = $(".post-new-page").data("userid");


    /* ---------- Model ---------- */
    var Log = Backbone.Model.extend({
      defaults: {
        "id": "",
        "text": "",
        "game": {
          "id": "",
          "title": "",
          "photo_path": "",
          "device": "",
          "maker": "",
          "game_like_count": 0
        },
        "status": {
          "id": "",
          "name": ""
        }
      }
    })

    var Game = Backbone.Model.extend({
      defaults: {
        "id": "",
        "title": "",
        "photo_path": "",
        "device": "",
        "maker": ""
      }
    })



    /* ---------- Collection ---------- */
    var Logs = Backbone.Collection.extend({
      model: Log,
      url: "/api/logs"
    })

    var logs = new Logs();



    /* ---------- View ---------- */
    var LogsView = Backbone.View.extend({
      tagName: "ul",
      className: "log-list",
      initialize: function () {
        this.collection = logs;
        this.listenTo(this.collection, "add", this.addLog);
      },
      addLog: function (log) {
        if(log.id){
          var log_view = new LogView({model: log});
          console.log(this.$el);
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
      template: _.template($("#game-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
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
        this.logs_view = new LogsView();
        this.$el.append(this.logs_view.el);
        this.attentions = [];
        this.playings = [];
        this.archives = [];
        var that = this;

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
                  break;
                case 2:
                  that.playings.push(log);
                  that.logs_view.collection.add(log);
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
        this.$el.find("ul.sortBox li").removeClass("current");
        this.logs_view.removeLogs();
        for(var i = 0; i < this.playings.length; i++){
          this.logs_view.addLog(this.playings[i]);
        }
        this.$el.find("ul.sortBox li.playing-li").addClass("current");
      },
      setAttention: function () {
        this.$el.find("ul.sortBox li").removeClass("current");
        this.logs_view.removeLogs();
        for(var i = 0; i < this.attentions.length; i++){
          this.logs_view.addLog(this.attentions[i]);
        }
        this.$el.find("ul.sortBox li.ready-li").addClass("current");
      },
      setArchive: function () {
        this.$el.find("ul.sortBox li").removeClass("current");
        this.logs_view.removeLogs();
        for(var i = 0; i < this.archives.length; i++){
          this.logs_view.addLog(this.archives[i]);
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
        this.game_id = location.href.split("/").pop();
        this.text = $("textarea")

        $.ajax({
          type: "GET",
          url: "/api/games/" + this.game_id,
          data: {},
          success: function (data) {
            var game = new Game(data.game);
            var game_view = new GameView({model: game});
            that.$el.prepend(game_view.render().el);
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
            "text": this.text.val()
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


    var Router = Backbone.Router.extend({
      routes: {
        "select": "select",
        "write/:game_id": "write",
        "add": "add"
      },
      select: function () {
        var app = new SelectView();
      },
      write: function () {
        var app = new WriteView();
      },
      add: function () {
        console.log("add");
      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();