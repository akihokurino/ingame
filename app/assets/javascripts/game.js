(function () {
  $(function () {
    var game_id = $(".game-page").data("gameid");

    var AppView = Backbone.View.extend({
      el: ".game-page",
      events: {
        "change .my_status": "changeStatus",
        "change .new_status": "registLog"
      },
      initialize: function () {
        this.my_status_select = $(".my_status")
        this.new_status_select = $(".new_status")
      },
      changeStatus: function () {
        var data = {
          "log": {
            "status_id": this.my_status_select.val()
          }
        }

        console.log(data);

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + game_id + "/update_status",
          data: data,
          success: function () {

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