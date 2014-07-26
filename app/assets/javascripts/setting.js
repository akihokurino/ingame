//= require ./models/result.js
//= require ./models/user.js
//= require ./collections/results.js
//= require ./collections/users.js
//= require ./libs/profile_upload.js

(function () {
  $(function () {
    /* ---------- Collection ---------- */
    var results = new Results();
    var users = new Users();



    /* ---------- View ---------- */
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
        if(this.$el.find("select").val() != ""){
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

    var UsersView = Backbone.View.extend({
      initialize: function () {
        this.collection = users;
        this.listenTo(this.collection, "add", this.addUser);
      },
      addUser: function (user) {
        if(user.id){
          var user_view = new UserView({model: user});
          this.$el.append(user_view.render().el);
        }
      }
    })

    var UserView = Backbone.View.extend({
      tagName: "li",
      className: "list",
      events: {
        "click .follow": "follow"
      },
      template: _.template($("#user-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
      },
      follow: function (e) {
        e.preventDefault();
        var that = this;
        var data = {
          "follow": {
            "to_user_id": this.model.id
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/follows",
          data: data,
          success: function (data) {
            if(data.result){
              that.$el.remove();
            }
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
        "keypress .search": "search",
        "click .next-page": "next"
      },
      template: _.template($("#first-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);
        this.results_view = new ResultsView({el: ".result-list"});
        this.collection = results;
        this.search_title = this.$(".search-title-input");
        var tmp = location.href.split("#")[0].split("/");
        tmp.pop();
        this.user_id = tmp.pop();
      },
      search: function (e) {
        if(e.which == 13){
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
        }
      },
      next: function (e) {
        e.preventDefault()
        location.href = "/users/" + this.user_id + "/setting#second";
      }
    })

    var SecondView = Backbone.View.extend({
      el: $(".setting-page"),
      events: {
        "keypress .user-input": "search",
        "click .next-page": "next"
      },
      template: _.template($("#second-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);
        this.users_view = new UsersView({el: ".user-list"});
        this.collection = users;
        this.username = $(".user-input");
        var tmp = location.href.split("#")[0].split("/");
        tmp.pop();
        this.user_id = tmp.pop();
      },
      search: function (e) {
        var that = this;
        var username = this.username.val();
        if(username && e.which == 13){
          e.preventDefault();
          this.collection.fetch({
            data: {username: username},
            success: function (model, response, options) {
              that.collection.reset();
              that.users_view.$el.html("");
              for(var i = 0; i < response.results.length; i++){
                var user = new User(response.results[i]);
                that.collection.add(user);

                if (i > 2) {
                  break;
                }
              }
            },
            error: function () {
              console.log("error");
            }
          });
        }
      },
      next: function (e) {
        e.preventDefault();
        location.href = "/users/" + this.user_id + "/setting#third";
      }
    })

    var ThirdView = Backbone.View.extend({
      el: $(".setting-page"),
      events: {
        "click .next-page": "next"
      },
      template: _.template($("#third-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);
        var tmp = location.href.split("#")[0].split("/");
        tmp.pop();
        this.user_id = tmp.pop();
        this.upload = new ProfileUpload("upload-btn", "thumbnail", this.user_id);
      },
      next: function (e) {
        e.preventDefault();
        location.href = "/posts";
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
        var app = new ThirdView();
      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();