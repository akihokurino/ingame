//= require ../../views/post_view.js
//= require ../../views/posts_view.js

(function () {

  var AllPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "all_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.all-posts").addClass("current");
    }
  });

  var FollowerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "follower_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.follower-posts").addClass("current");
    }
  });

  var LikerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "liker_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.liker-posts").addClass("current");
    }
  });

  var AppView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "change .my-status":     "changeStatus",
      "change .new-status":    "registLog",
      "change .my-rate":       "changeRate",
      "click .delete-log-btn": "showDeleteConfirm"
    },
    status_template: _.template($("#status-select-template").html()),
    review_template: _.template($("#review-select-template").html()),
    initialize: function () {
      _.bindAll(this, "destroyLog", "setDialog");

      this.game_id        = $(".game-page").data("gameid");
      this.review_list    = $(".review-li");
      this.status_list    = $(".status-li");
      this.delete_log_btn = $(".delete-log-btn");

      this.getCurrentGame();
    },
    changeRate: function () {
      var that = this;
      if (this.my_rate_select.val() != "") {
        var data = {
          "log": {
            "rate": this.my_rate_select.val()
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + this.game_id + "/update_status_or_rate",
          data: data,
          success: function (data) {
            that.setDialog("評価の値を変更しました");
          },
          error: function () {

          }
        });
      }
    },
    changeStatus: function () {
      var that = this;
      if (this.my_status_select.val() != "") {
        var data = {
          "log": {
            "status_id": this.my_status_select.val()
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + this.game_id + "/update_status_or_rate",
          data: data,
          success: function (data) {
            that.setDialog("ステータスを変更しました");
          },
          error: function () {

          }
        });
      }
    },
    registLog: function () {
      var that = this;
      var data = {
        "log": {
          "game_id": this.game_id,
          "status_id": this.new_status_select.val()
        }
      }

      if (req) {
        req.abort();
      }

      var req = $.ajax({
        type: "POST",
        url: "/api/logs",
        data: data,
        success: function (data) {
          that.setDialog("マイゲームに登録しました");

          var status = {
            my_status_id: that.new_status_select.val(),
            i_registed: true
          }
          that.setRegistedStatus(status);
        },
        error: function () {

        }
      });
    },
    getCurrentGame: function () {
      var that = this;
      $.ajax({
        type: "GET",
        url: "/api/games/" + this.game_id,
        success: function (data) {
          var status = {
            avg_rate:     data.avg_rate,
            i_registed:   data.i_registed,
            my_rate:      data.my_rate,
            my_status_id: data.my_status_id
          }
          that.setCurrentStatus(status);
        },
        error: function () {

        }
      });
    },
    setCurrentStatus: function (status) {
      this.status_list.html(this.status_template({i_registed: status.i_registed}));

      if (status.i_registed) {
        this.review_list.html(this.review_template());
        this.my_status_select = $(".my-status");
        this.my_rate_select   = $(".my-rate");

        if (status.my_status_id) {
          this.my_status_select.val(status.my_status_id);
        }

        if (status.my_rate) {
          this.my_rate_select.val(status.my_rate);
        }

        this.delete_log_btn.css("display", "block");
      } else {
        this.new_status_select = $(".new-status");

        this.delete_log_btn.css("display", "none");
      }
    },
    setRegistedStatus: function (status) {
      this.status_list.html(this.status_template({i_registed: status.i_registed}));
      this.review_list.html(this.review_template());
      this.my_status_select = $(".my-status");
      this.my_rate_select   = $(".my-rate");
      this.delete_log_btn.css("display", "block");

      if (status.my_status_id) {
        this.my_status_select.val(status.my_status_id);
      }
    },
    setUnRegistedStatus: function (status) {
      this.status_list.html(this.status_template({i_registed: status.i_registed}));
      this.review_list.html("");
      this.new_status_select = $(".new-status");
      this.delete_log_btn.css("display", "none");
    },
    destroyLog: function () {
      var that = this;
      $.ajax({
        type: "DELETE",
        url: "/api/logs/" + this.game_id,
        data: {},
        success: function (data) {
          that.setDialog("マイゲームから削除しました");

          var status = {
            i_registed: false
          }

          that.setUnRegistedStatus(status);
        },
        error: function () {

        }
      });
    },
    showDeleteConfirm: function () {
      var custom_modal_view = new CustomModalView({
        attributes: {
          view: null,
          title: "このゲームをマイゲームから削除しますか？",
          desc: "このゲームに関する投稿データもすべて削除されます",
          callback: this.destroyLog,
          template: _.template($("#delete-confirm-template").html()),
          className: "deleteConfirmModal",
        }
      });
    },
    setDialog: function (message) {
      var that = this;
      that.$el.remove(".message-dialog");
      this.$el.append(_.template($("#flash-template").html())({message: message}));
      setTimeout(function () {
        that.$el.find(".message-dialog").animate({"opacity": 0}, 1000, function () {
          that.$el.remove(".message-dialog");
        });
      }, 2000);
    }
  });


  var Router = Backbone.Router.extend({
    routes: {
      "all":      "all",
      "follower": "follower",
      "liker":    "liker"
    },
    all: function () {
      this.current_list = new AllPostListView();
    },
    follower: function () {
      this.current_list = new FollowerPostListView();
    },
    liker: function () {
      this.current_list = new LikerPostListView();
    }
  });


  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();