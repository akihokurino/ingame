//= require ../../models/result.js
//= require ../../models/user.js
//= require ../../collections/results.js
//= require ../../collections/users.js
//= require ../../libs/profile_upload.js

(function () {
  $(function () {


    /* ---------- View ---------- */

    var ResultsView = Backbone.View.extend({
      initialize: function () {
        this.listenTo(this.collection, "add", this.addResult);
      },
      addResult: function (result) {
        if (result.id) {
          result.strimWidth(40);
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
              $(".next-page").attr("value", "次へ");
              that.remove();
            },
            error: function () {

            }
          })
        }
      }
    })

    var UsersView = Backbone.View.extend({
      initialize: function () {
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
      className: "item",
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
            if (data.result) {
              that.$el.remove();
            }
            $(".next-page").attr("value", "次へ");
          },
          error: function () {

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

        _.bindAll(this, "pagenation");

        this.result_collection    = new Results();
        this.results_view         = new ResultsView({el: ".result-list", collection: this.result_collection});
        this.search_title         = this.$(".search-title-input");
        this.current_search_title = null;

        var tmp                   = location.href.split("#")[0].split("/");
        this.user_id              = tmp.pop() && tmp.pop();
        this.page                 = 1;
      },
      search: function (e) {
        if (e.which == 13 && this.search_title.val()) {
          e.preventDefault();

          var that                  = this;
          this.page                 = 1;
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

          $(window).unbind("scroll");
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
      },
      next: function (e) {
        e.preventDefault();
        location.href = "/users/" + this.user_id + "/setting#second";
      }
    })

    var SecondView = Backbone.View.extend({
      el: $(".setting-page"),
      events: {
        "keypress .user-input": "search",
        "click .next-page":     "next"
      },
      template: _.template($("#second-template").html()),
      initialize: function () {
        this.$el.html("");
        this.$el.append(this.template);

        _.bindAll(this, "pagenation");

        this.user_collection  = new Users();
        this.users_view       = new UsersView({el: ".user-list", collection: this.user_collection});
        this.username         = this.$(".user-input");
        this.current_username = null

        var tmp               = location.href.split("#")[0].split("/");
        this.user_id          = tmp.pop() && tmp.pop();
        this.page             = 1;
      },
      search: function (e) {
        if (e.which == 13 && this.username.val()) {
          e.preventDefault();

          var that              = this;
          this.page             = 1;
          this.current_username = this.username.val();

          this.user_collection.fetch({
            data: {username: this.current_username, page: this.page},
            success: function (model, response, options) {
              that.user_collection.reset();
              that.users_view.$el.html("");

              if (response.results && response.results.length > 0) {
                for (var i = 0; i < response.results.length; i++) {
                  var user = new User(response.results[i]);
                  that.users_view.collection.add(user);
                }
              }
            },
            error: function () {

            }
          });

          $(window).unbind("scroll");
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

          this.user_collection.fetch({
            data: {username: this.current_username, page: this.page},
            success: function (model, response, options) {
              if (response.results && response.results.length > 0) {
                for (var i = 0; i < response.results.length; i++) {
                  var result = new Result(response.results[i]);
                  that.users_view.collection.add(result);
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

        var tmp      = location.href.split("#")[0].split("/");
        this.user_id = tmp.pop() && tmp.pop();

        this.upload  = new ProfileUpload("upload-btn", "thumbnail", this.user_id);
      },
      next: function (e) {
        e.preventDefault();
        location.href = "/posts";
      }
    })



    /* ---------- Router --------- */

    var Router = Backbone.Router.extend({
      routes: {
        "first":  "first",
        "second": "second",
        "third":  "third"
      },
      first: function () {
        this.current_app = new FirstView();
      },
      second: function () {
        this.current_app = new SecondView();
      },
      third: function () {
        this.current_app = new ThirdView();
      }
    })

    var router = new Router();
    Backbone.history.start();
  })
})();