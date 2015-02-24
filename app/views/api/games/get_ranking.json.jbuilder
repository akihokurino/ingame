json.results do |json|
  json.array!(@results) do |result|
    json.id result[:id]
    json.title result[:title]
    json.photo_path result[:photo_path]
    json.photo_url result[:photo_url]
    json.device result[:device]
    json.maker result[:maker]
    json.release_day result[:release_day]
    json.avg_rate result.avg_rate
    json.i_registed result.i_registed
    json.my_status_id result.my_status_id
  end
end