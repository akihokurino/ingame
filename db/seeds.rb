# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

%w(
	気になる
	遊んでる
	遊んだ
  積んでる
).each_with_index do |status, index|
	Status.create(name: status)
end

%w(
  をフォローしました
  の投稿にいいね！と言っています
  の投稿にコメントしました
  のコメントにいいね！と言っています
).each do |value|
  NotificationType.create(value: value)
end
