json.results do |json|
  json.array!(@result[:games]) do |game|
  	json.id game[:id]
  	json.title game[:title]
    json.photo_path game[:photo_path]
    json.photo_url game[:photo_url]
    json.device game[:device]
    json.maker game[:maker]
    json.release_day game[:release_day]
    json.avg_rate game.avg_rate
    json.i_registed game.i_registed
    json.my_status_id game.my_status_id
  end
end

json.count @result[:count]