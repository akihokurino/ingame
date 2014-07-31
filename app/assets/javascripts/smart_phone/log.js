//= require ../models/log.js
//= require ../models/result.js
//= require ../collections/logs.js
//= require ../collections/results.js

(function () {
  $(function () {
    var user_id = $(".logs-page").data("userid");

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
        "change .my_status": "changeStatus",
        "change .my_rate": "changeRate"
      },
      initialize: function () {
      },
      template: _.template($("#log-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
      },
      changeStatus: function () {
        if (this.$el.find(".my_status").val() != "") {
          var game_id = this.model.get("game").id;
          var data = {
            "log": {
              "status_id": this.$el.find(".my_status").val()
            }
          }

          $.ajax({
            type: "PUT",
            url: "/api/logs/" + game_id + "/update_status_or_rate",
            data: data,
            success: function (data) {
              console.log(data);
            },
            error: function () {
              console.log("error");
            }
          })
        }
      },
      changeRate: function () {
        if(this.$el.find(".my_rate").val() != "") {
          var game_id = this.model.get("game").id;
          var data = {
            "log": {
              "rate": this.$el.find(".my_rate").val()
            }
          }

          $.ajax({
            type: "PUT",
            url: "/api/logs/" + game_id + "/update_status_or_rate",
            data: data,
            success: function () {

            },
            error: function () {
              console.log("error");
            }
          })
        }
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



    var EditView = Backbone.View.extend({
      el: $(".logs-page"),
      events: {
        "click .playing": "setPlaying",
        "click .ready": "setAttention",
        "click .played": "setArchive",
        "keypress .search-log": "search"
      },
      template: _.template($("#edit-template").html()),
      initialize: function () {
        var that = this;

        this.$el.html("");
        this.$el.append(this.template);

        this.logs_view = new LogsView({el: "ul.gameList"});

        this.attentions = [];
        this.playings = [];
        this.archives = [];

        this.logs_view.collection.reset();

        this.search_log_title = $(".search-log");
        this.current_tab = null;

        $.ajax({
          type: "GET",
          url: "/api/logs?user_id=" + user_id,
          data: {},
          success: function (data) {
            console.log(data);
            for(var i = 0; i < data.logs.length; i++){
              var log = new Log(data.logs[i]);
              switch(log.get("status").id){
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
            console.log("error");
          }
        })
      },
      setAttention: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.attentions.length; i++){
          this.logs_view.collection.add(this.attentions[i]);
        }
        this.$el.find("ul.sortBox li.ready-li").addClass("current");
        this.current_tab = 1;
      },
      setPlaying: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.playings.length; i++){
          this.logs_view.collection.add(this.playings[i]);
        }
        this.$el.find("ul.sortBox li.playing-li").addClass("current");
        this.current_tab = 2;
      },
      setArchive: function () {
        this.logs_view.collection.reset();
        this.logs_view.removeLogs();
        this.$el.find("ul.sortBox li").removeClass("current");
        for(var i = 0; i < this.archives.length; i++){
          this.logs_view.collection.add(this.archives[i]);
        }
        this.$el.find("ul.sortBox li.played-li").addClass("current");
        this.current_tab = 3;
      },
      search: function (e) {
        e.preventDefault();
        if (e.which == 13 && this.search_log_title.val() != "") {
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

    var AddView = Backbone.View.extend({
      el: $(".logs-page"),
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

    var Router = Backbone.Router.extend({
      routes: {
        "edit": "edit",
        "add": "add"
      },
      edit: function () {
        this.current_app = new EditView();
      },
      add: function () {
        this.current_app = new AddView();
      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();