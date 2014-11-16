require "date"
require "uri"

namespace :amazon_from_title do
	desc "タイトルとデバイスを指定してamazonからURLと画像を引っ張ってくる"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'

    # url開いてソースを文字列で返す。
    def get(url)
      html   = nil
      status = nil

      for i in 1..5
        open(url, "User-Agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:33.0) Gecko/20100101 Firefox/33.0"){|f|
          html   = f.read
          status = f.status[0].to_i
        }

        if status == 200
          return html
        elsif status == 404
          return 404
        else
          sleep i
        end
      end
      warn "[status:#{status}] #{url}"
      exit 1
    end

		def search(title, device)
      keywords = URI.encode "#{title} #{device}"
      url = "http://www.amazon.co.jp/s/?url=search-alias%3Dvideogames&field-keywords=#{keywords}"
      return get url
		end

    while true
      # メモリ足りなくなりそうだから100件ずついきます。
      games = Game.where(photo_url: nil).order("release_day DESC").limit(100)
      for game in games
        p "#{game.title} (#{game.device})"
        doc = Nokogiri::HTML.parse search(game.title, game.device)
        mostPossible = doc.css("div#atfResults > li#result_0")[0]
        next if mostPossible.nil?
# とりあえず途中まで。ここでぶち込んで保存するだけだから。
# 既にファミ通から画像取ってたことが判明した。
# 故に、amazonをあさってもこれ以上画像が手に入ることはなく、ここで打ち切る。
        p game.title
        p mostPossible.css("img.s-access-image")[0].attr "src"
        p mostPossible.css("a.s-access-detail-page")[0].attr "href"
        exit 0
      end
      break if games.length == 0
    end
  end
end
