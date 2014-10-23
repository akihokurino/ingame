rake db:migrate:reset
rake db:seed
rake db:fixtures:load FIXTURES=users
rake db:fixtures:load FIXTURES=posts
rake db:fixtures:load FIXTURES=logs
rake db:fixtures:load FIXTURES=notifications

