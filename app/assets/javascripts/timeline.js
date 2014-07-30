//= require ./models/post.js
//= require ./models/game.js
//= require ./models/user.js
//= require ./collections/posts.js
//= require ./collections/games.js
//= require ./collections/users.js

(function () {
	$(function () {
		var page = 1;

		/* ---------- Collection ---------- */

		var posts = new Posts();
		var users = new Users();



		/* ---------- View ---------- */
		var PostFormView = Backbone.View.extend({
			el: $(".post-form"),
			events: {
				"submit": "savePost"
			},
			initialize: function () {
				this.collection = posts;
				this.text = $(".text-input");
				this.game_select = $(".game-select");
			},
			savePost: function (e) {
				e.preventDefault();

				var that = this;

				var data = {
					"post": {
						"text": this.text.val(),
						"game_id": this.game_select.val()
					}
				}

				this.collection.create(data, {
					method: "POST",
					success: function (response) {
						var post = new Post(response.attributes.post);
						that.collection.add(post);
					},
					error: function () {
						console.log("error");
					}
				});
			}
		})

		var GamesSelectView = Backbone.View.extend({
			el: $(".game-select"),
			initialize: function () {
				var that = this;
				this.collection = new Games();
				this.listenTo(this.collection, "add", this.addGame);
			},
			addGame: function (game) {
				if(game.id){
					var game_view = new GameView({model: game});
					this.$el.append(game_view.render().el);
				}
			}
		})

		var GameView = Backbone.View.extend({
			tagName: "option",
			template: _.template($("#game-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				this.$el.attr("value", this.model.id);
				return this;
			}
		})

		var PostsView = Backbone.View.extend({
			el: $(".post-list"),
			initialize: function () {
				var that = this;
				this.collection = posts;
				this.listenTo(this.collection, "add", this.addPost);
			},
			addPost: function (post) {
				if(post.id){
					var post_view = new PostView({model: post});
					this.$el.append(post_view.render().el);
				}
			}
		})

		var PostView = Backbone.View.extend({
			tagName: "article",
			className: "postBox",
			events: {
				"click .delete": "destroy",
				"click .like" : "like",
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

		var UsersView = Backbone.View.extend({
			el: $(".user-list"),
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
			template: _.template($("#user-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		})

		var UserSearchView = Backbone.View.extend({
			el: ".user-input",
			events: {
				"keypress": "search"
			},
			initialize: function () {
				this.collection = users;
				this.username = $(".user-input");
			},
			search: function (e) {
				var that = this;
				var username = this.username.val();
				if(username && e.which == 13){
					this.collection.fetch({
						data: {username: username},
						success: function (model, response, options) {
							that.collection.reset();
							app.users_view.$el.html("");
							for(var i = 0; i < response.results.length; i++){
								var user = new User(response.results[i]);
								that.collection.add(user);
							}
						},
						error: function () {
							console.log("error");
						}
					});
				}
			}
		})

		var AppView = Backbone.View.extend({
			el: ".timeline-page",
			initialize: function () {
				this.post_form_view = new PostFormView();
				this.games_select_view = new GamesSelectView();
				this.posts_view = new PostsView();
				this.user_search_view = new UserSearchView();
				this.users_view = new UsersView();
				this.collection = posts;

				var that = this;

				this.collection.fetch({
					data: {page: page},
					success: function (model, response, options) {
						for(var i = 0; i < response.games.length; i++){
							var game = new Game(response.games[i]);
							that.games_select_view.collection.add(game);
						}
						for(var i = 0; i < response.posts.length; i++){
							var post = new Post(response.posts[i]);
							that.posts_view.collection.add(post);
						}
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var app = new AppView();

		$(window).bind("scroll", pagenation);
		function pagenation(){
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();
			if((scrollHeight - scrollPosition) / scrollHeight <= 0.1){
				$(".loading-gif").css("display", "block");
				$(window).unbind("scroll");
				page += 1;

				app.collection.fetch({
					data: {page: page},
					success: function (model, response, options) {
						for(var i = 0; i < response.posts.length; i++){
							var post = new Post(response.posts[i]);
							app.posts_view.collection.add(post);
						}
						$(".loading-gif").css("display", "none");
					},
					error: function () {
						console.log("error");
					}
				})
			}
		}
	})
})();