//= require ../../models/post.js
//= require ../../models/user.js
//= require ../../collections/posts.js
//= require ../../collections/users.js

(function () {
  $(function () {
    var game_id = $(".game-page").data("gameid");

    /* ---------- Collection ---------- */
    var posts   = new Posts();



    /* ---------- View ---------- */

    var PostsView = Backbone.View.extend({
      el: $(".post-list"),
      initialize: function () {
        this.collection = posts;
        this.listenTo(this.collection, "add", this.addPost);
      },
      addPost: function (post) {
        if(post.id){
          post.strimWidth(40);
          var post_view = new PostView({model: post});
          this.$el.prepend(post_view.render().el);
        }
      },
      removePosts: function () {
        this.$el.html("");
      }
    })

    var PostView = Backbone.View.extend({
      tagName:   "article",
      className: "postBox",
      events: {
        "click .delete": "destroy",
        "click .like" :  "like",
        "click .unlike": "unlike"
      },
      initialize: function () {
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "change", this.render);
      },
      destroy: function () {
        this.model.destroy();
      },
      remove: function () {
        this.$el.remove();
      },
      template: _.template($("#post-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
      },
      like: function () {
        var data = {
          "post_like": {
            "post_id": this.model.id,
            "user_id": null
          }
        };
        var that = this;

        $.ajax({
          type: "POST",
            url: "/api/post_likes",
            data: data,
            success: function (data) {
              if(data){
                that.model.set({
                  "i_liked": true,
                  "post_likes_count": parseInt(that.model.get("post_likes_count")) + 1
                });
              }
            },
            error: function () {
              console.log("error");
            }
        })
      },
      unlike: function () {
        var that = this;
        $.ajax({
          type: "DELETE",
          url: "/api/post_likes/" + this.model.id,
          data: {},
          success: function (data) {
            if(data){
                that.model.set({
                  "i_liked": false,
                  "post_likes_count": parseInt(that.model.get("post_likes_count")) - 1
                });
              }
          },
          error: function () {
            console.log("error");
          }
        })
      }
    })

    var AppView = Backbone.View.extend({
      el: ".game-page",
      events: {
        "change .my_status":     "changeStatus",
        "change .new_status":    "registLog",
        "change .my_rate":       "changeRate",
        "click .follower_posts": "setFollowerPosts",
        "click .all_posts":      "setAllPosts",
        "click .liker_posts":    "setLikerPosts"
      },
      initialize: function () {
        var that               = this;
        this.posts_view        = new PostsView();

        this.my_status_select  = $(".my_status");
        this.new_status_select = $(".new_status");

        this.my_rate_select    = $(".my_rate");

        this.follower_posts    = [];
        this.all_posts         = [];
        this.liker_posts       = [];

        $.ajax({
          type: "GET",
          url: "/api/posts/index_of_game?game_id=" + game_id,
          data: {},
          success: function (data) {
            for (var i = 0; i < data.follower_posts.length; i++) {
              var post = new Post(data.follower_posts[i]);
              that.follower_posts.push(post);
              that.posts_view.collection.add(post)
            }

            for (var i = 0; i < data.all_posts.length; i++) {
              var post = new Post(data.all_posts[i]);
              that.all_posts.push(post);
            }

            for (var i = 0; i < data.liker_posts.length; i++) {
              var post = new Post(data.liker_posts[i]);
              that.liker_posts.push(post);
            }
          },
          error: function () {
            console.log("error");
          }
        })
      },
      changeRate: function () {
        if (this.my_rate_select.val() != "") {
          var data = {
            "log": {
              "rate": this.my_rate_select.val()
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
      changeStatus: function () {
        if (this.my_status_select.val() != "") {
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
        }
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
      },
      setFollowerPosts: function () {
        this.posts_view.collection.reset();
        this.posts_view.removePosts();
        this.$el.find("ul.sortBox li").removeClass("current");
        for (var i = 0; i < this.follower_posts.length; i++) {
          this.posts_view.collection.add(this.follower_posts[i]);
        }
        this.$el.find("ul.sortBox li.follower_posts").addClass("current");
      },
      setAllPosts: function () {
        this.posts_view.collection.reset();
        this.posts_view.removePosts();
        this.$el.find("ul.sortBox li").removeClass("current");
        for (var i = 0; i < this.all_posts.length; i++) {
          this.posts_view.collection.add(this.all_posts[i]);
        }
        this.$el.find("ul.sortBox li.all_posts").addClass("current");
      },
      setLikerPosts: function () {
        this.posts_view.collection.reset();
        this.posts_view.removePosts();
        this.$el.find("ul.sortBox li").removeClass("current");
        for (var i = 0; i < this.liker_posts.length; i++) {
          this.posts_view.collection.add(this.liker_posts[i]);
        }
        this.$el.find("ul.sortBox li.liker_posts").addClass("current");
      }
    })

    var app = new AppView();
  })
})();