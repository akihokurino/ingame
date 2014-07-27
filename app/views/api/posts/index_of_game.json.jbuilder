json.all_posts do |json|
  json.array!(@all_posts) do |post|
    json.id post[:id]
    json.text post[:text]
    json.i_liked post.i_liked
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
    json.current_user_id @current_user[:id]
  end
end

json.follower_posts do |json|
  json.array!(@follower_posts) do |post|
    json.id post[:id]
    json.text post[:text]
    json.i_liked post.i_liked
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
    json.current_user_id @current_user[:id]
  end
end

