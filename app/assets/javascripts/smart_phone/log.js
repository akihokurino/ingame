//= require ../models/log.js
//= require ../collections/logs.js

(function () {
  $(function () {
    var user_id = $(".logs-page").data("userid");

    /* ---------- Collection ---------- */
    var logs = new Logs();



    /* ---------- View ---------- */
    var LogsView = Backbone.View.extend({
      el: "ul.gameList",
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


    var AppView = Backbone.View.extend({
      el: $(".logs-page"),
      events: {
        "click .playing": "setPlaying",
        "click .ready": "setAttention",
        "click .played": "setArchive"
      },
      initialize: function () {
        var that = this;

        this.logs_view = new LogsView();
        //this.$el.find(".select-page").append(this.logs_view.el);

        this.attentions = [];
        this.playings = [];
        this.archives = [];

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

    var app = new AppView();
  })
})();