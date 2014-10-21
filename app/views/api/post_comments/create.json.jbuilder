json.comment do |json|
	json.id @comment[:id]
	json.text @comment[:text]
  json.comment_likes_count @comment[:comment_likes_count]
  json.created_at @comment.datetime
	json.user do |json|
		json.id @comment.user[:id]
		json.username @comment.user[:username]
		json.photo_path @comment.user[:photo_path]
	end
end
