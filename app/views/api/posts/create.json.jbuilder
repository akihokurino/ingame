json.post do |json|
  json.id @last_post[:id]
  json.text @last_post[:text]
  json.post_likes_count @last_post[:post_likes_count]
  json.game do |json|
  	json.id @last_post.game[:id]
  	json.title @last_post.game[:title]
    json.photo_path @last_post.game[:photo_path]
  end
  json.user do |json|
    json.id @last_post.user[:id]
    json.username @last_post.user[:username]
    json.photo_path @last_post.user[:photo_path]
  end
  json.current_user_id @current_user[:id]
end