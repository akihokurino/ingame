//= require ../models/result.js
//= require ../models/user.js
//= require ../collections/results.js
//= require ../collections/users.js

(function () {
  $(function () {
    /* ---------- Collection ---------- */
    var results = new Results();
    var users   = new Users();



    /* ---------- View ---------- */
    var ResultsView = Backbone.View.extend({
      initialize: function () {
        this.collection = results;
        this.listenTo(this.collection, "add", this.addResult);
      },
      addResult: function (result) {
        if (result.id) {
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
        if (this.$el.find(".status").val() != "") {
          var that = this;
          var data = {
            "log": {
              "game_id":   this.model.id,
              "status_id": this.$el.find(".status").val()
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
        if (user.id) {
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


    var GameSearchView = Backbone.View.extend({
      el: $(".search-page"),
      events: {
        "keypress .search": "search"
      },
      template: _.template($("#game-search-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);
        this.results_view       = new ResultsView({el: ".result-list"});
        this.collection         = results;
        this.game_title         = $(".game-title-input");
        this.current_game_title = null;
        this.page               = 1;
      },
      search: function (e) {
        if (e.which == 13 && this.game_title.val()) {
          e.preventDefault();
          var that                = this;
          this.page               = 1;
          this.current_game_title = this.game_title.val();
          this.collection.fetch({
            data: {search_title: this.current_game_title, page: this.page},
            success: function (model, response, options) {
              that.collection.reset();
              that.results_view.$el.html("");
              if (response.results && response.results.length > 0) {
                for (var i = 0; i < response.results.length; i++) {
                  var result = new Result(response.results[i]);
                  that.collection.add(result);
                }
              }

              $(window).unbind("scroll");
              $(window).bind("scroll", game_pagenation);
            },
            error: function () {
              console.log("error");
            }
          })
        }
      }
    })

    var UserSearchView = Backbone.View.extend({
      el: $(".search-page"),
      events: {
        "keypress .search": "search"
      },
      template: _.template($("#user-search-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);
        this.users_view       = new UsersView({el: ".result-list"});
        this.collection       = users;
        this.username         = $(".username-input");
        this.current_username = null;
        this.page             = 1;
      },
      search: function (e) {
        if (e.which == 13 && this.username.val()) {
          e.preventDefault();
          var that              = this;
          this.page             = 1;
          this.current_username = this.username.val();
          this.collection.fetch({
            data: {username: this.current_username, page: this.page},
            success: function (model, response, options) {
              that.collection.reset();
              that.users_view.$el.html("");
              for (var i = 0; i < response.results.length; i++) {
                var user = new User(response.results[i]);
                that.collection.add(user);
              }

              $(window).unbind("scroll");
              $(window).bind("scroll", user_pagenation);
            },
            error: function () {
              console.log("error");
            }
          });
        }
      }
    })


    function game_pagenation () {
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();

      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");

        var app   = router.current_app;
        app.page += 1;

        app.collection.fetch({
          data: {search_title: app.current_game_title, page: app.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var result = new Result(response.results[i]);
                app.collection.add(result);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", game_pagenation);
            }
          },
          error: function () {
            console.log("error");
          }
        })
      }
    }

    function user_pagenation () {
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();

      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");

        var app   = router.current_app;
        app.page += 1;

        app.collection.fetch({
          data: {username: app.current_username, page: app.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var user = new User(response.results[i]);
                app.collection.add(user);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", user_pagenation);
            }
          },
          error: function () {
            console.log("error");
          }
        });
      }
    }


    var Router = Backbone.Router.extend({
      routes: {
        "game": "game",
        "user": "user"
      },
      game: function () {
        this.current_app = new GameSearchView();
      },
      user: function () {
        this.current_app = new UserSearchView();
      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();