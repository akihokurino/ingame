(function () {
  $(function () {

    /* ---------- Model ---------- */
    var Result = Backbone.Model.extend({
      urlRoot: "/api/logs",
      defaults: {
        "title": "",
        "photo_path": ""
      }
    })



    /* ---------- Collection ---------- */
    var Results = Backbone.Collection.extend({
      model: Result,
      url: "/api/games/search"
    })

    var results = new Results();



    /* ---------- View ---------- */
    var ResultsView = Backbone.View.extend({
      tagName: "ul",
      className: "result-list",
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
      events: {
        "click .regist-btn": "regist"
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
    })

    var FirstView = Backbone.View.extend({
      el: $(".setting-page"),
      events: {
        "submit": "search",
        "click .next-page": "next"
      },
      template: _.template($("#first-template").html()),
      initialize: function () {
        var that = this;
        this.$el.html("");
        this.$el.append(this.template);
        this.results_view = new ResultsView();
        this.$el.append(this.results_view.el);
        this.collection = results;
        this.search_title = this.$(".search-title-input");
        var tmp = location.href.split("#")[0].split("/");
        tmp.pop();
        this.user_id = tmp.pop();
      },
      search: function (e) {
        e.preventDefault();
        var that = this;
        var search_title = this.search_title.val();
        this.collection.fetch({
          data: {search_title: search_title},
          success: function (model, response, options) {
            that.collection.reset();
            that.results_view.$el.html("");
            if(response.results && response.results.length > 0){
              for(var i = 0; i < response.results.length; i++){
                var result = new Result(response.results[i]);
                that.collection.add(result);
              }
            }
          },
          error: function () {
            console.log("error");
          }
        })
      },
      next: function () {
        location.href = "/users/" + this.user_id + "/setting#second";
      }
    })

    var SecondView = Backbone.View.extend({
      el: $(".setting-page"),
      template: _.template($(".second-template")),
      initialize: function () {
        var that = this;
        this.$el.html("");
        this.$el.append(this.template);
      }
    })

    var Router = Backbone.Router.extend({
      routes: {
        "first": "first",
        "second": "second",
        "third": "third"
      },
      first: function () {
        var app = new FirstView();
      },
      second: function () {
        var app = new SecondView();
      },
      third: function () {

      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();