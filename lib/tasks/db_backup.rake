namespace :db_backup do
  desc "mysqldump"
  task :run => :environment do
    require 'gmail'

    proj_root_dir = File.expand_path "../../../", __FILE__
    dump_path     = "#{proj_root_dir}/dump/ingame_dump.#{DateTime.now}.sql.gz"
    `mysqldump -uroot -pingameplaydygamr inagem_production | gzip > #{dump_path}`

    gmail = Gmail.connect('gamr.jp@gmail.com', 'ingameplaydygamr')

    gmail.deliver do
      to "gamr.jp@gmail.com"
      subject "GamrのDBのバックアップ"
      text_part do
        body "gamrのDBのバックアップです。安心を定期的にお届けします。"
      end
      add_file dump_path
    end

    gmail.logout

    `rm #{dump_path}`
  end
end