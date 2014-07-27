//= require ./models/post.js
//= require ./models/user.js
//= require ./collections/posts.js
//= require ./collections/users.js

(function () {
  $(function () {
    var game_id = $(".game-page").data("gameid");

    /* ---------- Collection ---------- */
    var posts = new Posts();



    /* ---------- View ---------- */
    var AppView = Backbone.View.extend({
      el: ".game-page",
      events: {
        "change .my_status": "changeStatus",
        "change .new_status": "registLog"
      },
      initialize: function () {
        this.my_status_select = $(".my_status");
        this.new_status_select = $(".new_status");

        this.follower_posts = [];
        this.all_posts = [];
        this.rating_posts = [];

        $.ajax({
          type: "GET",
          url: "/api/posts/index_of_game?game_id=" + game_id,
          data: {},
          success: function (data) {
            console.log(data);
          },
          error: function () {
            console.log("error");
          }
        })
      },
      changeStatus: function () {
        var data = {
          "log": {
            "status_id": this.my_status_select.val()
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
      },
      registLog: function () {
        var data = {
          "log": {
            "game_id": game_id,
            "status_id": this.new_status_select.val()
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/logs",
          data: data,
          success: function () {

          },
          error: function () {
            console.log("error");
          }
        })
      }
    })

    var app = new AppView();
  })
})();