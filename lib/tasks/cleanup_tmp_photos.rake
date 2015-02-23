namespace :tmp_photos do
  desc "clear tmp_photos"
  task :cleanup => :environment do
    proj_root_dir = File.expand_path "../../../", __FILE__

    `rm -rf #{proj_root_dir}/public/tmp_photos/*`
  end
end