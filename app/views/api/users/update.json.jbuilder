json.result @result

unless @error.nil?
  json.error @error
end