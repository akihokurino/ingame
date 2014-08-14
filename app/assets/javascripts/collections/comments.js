var Comments = Backbone.Collection.extend({
  model: Comment,
  url: "/api/post_comments"
})