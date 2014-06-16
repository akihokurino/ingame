json.posts do |json|
  json.array!(@posts) do |post|
  	json.id post[:id]
  	json.text post[:text]
    json.post_likes_count post[:post_likes_count]
  	json.game do |json|
      json.id post.game[:id]
      json.title post.game[:title]
      json.photo_path post.game[:photo_path]
    end
    json.user do |json|
      json.id post.user[:id]
      json.username post.user[:username]
      json.photo_path post.user[:photo_path]
    end
  end
end
