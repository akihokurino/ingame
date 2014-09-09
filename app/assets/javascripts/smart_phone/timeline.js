//= require ../models/post.js
//= require ../models/user.js
//= require ../models/comment.js
//= require ../collections/posts.js
//= require ../collections/users.js
//= require ../collections/comments.js

(function () {
	$(function () {
		var page     = 1;

		/* ---------- Collection ---------- */

		var posts    = new Posts();
		var users    = new Users();
		var comments = null;



		/* ---------- View ---------- */
		var PostsView = Backbone.View.extend({
			el: $(".post-list"),
			initialize: function () {
				this.collection = posts;
				this.listenTo(this.collection, "add", this.addPost);
			},
			addPost: function (post) {
				if (post.id) {
					var post_view = new PostView({model: post});
					this.$el.append(post_view.render().el);
				}
			}
		})

		var PostView = Backbone.View.extend({
			tagName: "article",
			className: "postBox",
			events: {
				"click .delete":      "destroy",
				"click .like" :       "like",
				"click .unlike":      "unlike",
				"click .comment-btn": "showComment",
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
						"user_id": null,
						"to_user_id": this.model.get("user").id
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
			},
			showComment: function (e) {
				e.preventDefault();

				app.comment_modal_view.model      = this.model;
				app.comment_modal_view.collection = new Comments(this.model.get("post_comments"));
				app.comments_view                 = new CommentsView({collection: app.comment_modal_view.collection});

				$(".comment-modal").css("display", "block");
				$(".layer").css("display", "block");
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
				this.username   = $(".user-input");
			},
			search: function (e) {
				var that     = this;
				var username = this.username.val();
				if (username && e.which == 13) {
					this.collection.fetch({
						data: {username: username},
						success: function (model, response, options) {
							that.collection.reset();
							app.users_view.$el.html("");
							for (var i = 0; i < response.results.length; i++) {
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

		var CommentsView = Backbone.View.extend({
			el: ".comment-list",
			initialize: function () {
				this.refresh();
				this.listenTo(this.collection, "add", this.addComment);
				this.render();
			},
			addComment: function (comment) {
				if (comment.id) {
					var comment_view = new CommentView({model: comment});
					this.$el.append(comment_view.render().el);
				}
			},
			refresh: function () {
				this.$el.html("");
			},
			render: function () {
				var that = this;
				this.collection.each(function (model) {
					var comment_view = new CommentView({model: model});
					that.$el.append(comment_view.render().el);
				})
				return this;
			}
		})

		var CommentView = Backbone.View.extend({
			tagName: "li",
			className: "comment",
			template: _.template($("#comment-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		})

		var CommentModalView = Backbone.View.extend({
			el: ".comment-modal",
			events: {
				"click .cancel-btn": "hideComment",
				"click .submit-btn": "postComment"
			},
			initialize: function () {
				this.collection    = comments;
				this.comment_input = this.$(".comment-input");
				this.model         = null;
			},
			hideComment: function () {
				app.comment_modal_view.model      = null;
				app.comment_modal_view.collection = null;
				app.comments_view                 = null;

				$(".comment-modal").css("display", "none");
				$(".layer").css("display", "none");

				this.comment_input.val("");
			},
			postComment: function () {
				if (this.comment_input.val() != "") {
					var that = this;

					var data = {
						"post_comment": {
							"post_id":    this.model.id,
							"text":       this.comment_input.val(),
							"to_user_id": this.model.get("user").id
						}
					}

					this.collection.create(data, {
						method: "POST",
						success: function (response) {
							var comment = new Comment(response.get("comment"));
							that.collection.add(comment);
							that.model.get("post_comments").push(response.get("comment"));
							that.model.set("post_comments_count", that.model.get("post_comments_count") + 1);

							that.comment_input.val("");
						},
						error: function () {
							console.log("error");
						}
					})
				}
			}
		})

		var AppView = Backbone.View.extend({
			el: ".timeline-page",
			initialize: function () {
				this.posts_view         = new PostsView();
				this.user_search_view   = new UserSearchView();
				this.users_view         = new UsersView();
				this.comment_modal_view = new CommentModalView();
				this.collection         = posts;

				var that                = this;

				this.collection.fetch({
					data: {page: page},
					success: function (model, response, options) {
						for (var i = 0; i < response.posts.length; i++) {
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
			var scrollHeight   = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();
			if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
				$(".loading-gif").css("display", "block");
				$(window).unbind("scroll");
				page += 1;

				app.collection.fetch({
					data: {page: page},
					success: function (model, response, options) {
						for (var i = 0; i < response.posts.length; i++) {
							var post = new Post(response.posts[i]);
							app.posts_view.collection.add(post);
						}

						$(".loading-gif").css("display", "none");

						if (response.posts.length != 0) {
							$(window).bind("scroll", pagenation);
						}
					},
					error: function () {
						console.log("error");
					}
				})
			}
		}
	})
})();