echo "initialize db..."
rake db:migrate:reset
echo "insert seed..."
rake db:seed
echo "insert game..."
filepath=dump/ingame_development.sql
if [ -e $filepath ]; then
  mysql -u"$1" -p"$2" ingame_development < $filepath
else
  echo "dump file not exist"
fi
echo "insert user dammy data..."
rake db:fixtures:load FIXTURES=users
echo "insert post dammy data..."
rake db:fixtures:load FIXTURES=posts
echo "insert log dammy data..."
rake db:fixtures:load FIXTURES=logs
echo "insert notification dammy data..."
rake db:fixtures:load FIXTURES=notifications