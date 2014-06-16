json.logs do |json|
  json.array!(@logs) do |log|
  	json.id log[:id]
  	json.text log[:text]
  	json.game do |json|
      json.id log.game[:id]
      json.title log.game[:title]
      json.photo_path log.game[:photo_path]
      json.device log.game[:device]
      json.price log.game[:price]
      json.maker log.game[:maker]
      json.release_day log.game[:release_day]
      json.game_likes_count log.game[:game_likes_count]
    end
    json.status do |json|
      json.name log.status.name
    end
  end
end