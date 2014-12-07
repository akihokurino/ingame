json.results do |json|
  json.array!(@result[:users]) do |user|
    json.id user[:id]
    json.username user[:username]
    json.introduction user[:introduction]
    json.photo_path user[:photo_path]
    json.place user[:place]
    json.logs_count user[:logs_count]
    json.i_followed user.i_followed
    json.i_followered user.i_followered
  end
end
json.count @result[:count]