# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

%w(
	気になる
	プレイ中
	アーカイブ
).each_with_index do |status, index|
	Status.create(name: status)
end

%w(
  をフォローしました
  のポストにいいね！と言っています
  のポストにコメントしました
  のコメントにいいね！と言っています
).each do |value|
  NotificationType.create(value: value)
end
