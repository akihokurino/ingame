require "date"

namespace :famituu do
	desc "scraping from famituu"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'
    def get(url)
      # url開いてソースを文字列で返す。
      html = open(url){|f| f.read}
      return html
    end
		def search(date)
      # 日付を引数に取るよう、そのうち書き直す。
      # とりあえず、2014/10/2決め打ちで。
      url = "http://www.famitsu.com/schedule/calendar/all/#{date.year}/#{date.month}/#{date.day}/?kaigai=1"
			return get url
		end
    date = Date.parse("2014/10/02")
		for i in 1..1#1000
			doc = Nokogiri::HTML.parse(search date)
			searchResults = doc.css("li.listBgForword")
			break if searchResults.length == 0
      isAlready = {}
			searchResults.each do |row|
				result = {}
        result[:provider] = "famituu"
        result[:release_day] = date.strftime("%Y-%m-%d")
        game_url = nil

        # デバイス,IDの取得
        devices = []
        row.css("h3.itemName > a").each do |a|
          href = a.attr("href")
          if href.index("http://www.famitsu.com/cominy/")
            isGame = true
            result[:provider_id] = href.gsub(/^.*title_id=/, '').to_i
            game_url = href
          else
            name = href.gsub(/^.*calendar\//, '').gsub(/\/.*$/, '')
            devices << name unless name == "all"
          end
        end
        result[:devices] = devices
        next unless game_url # コントローラとかを除外。
        next if isAlready[result[:provider_id]] # （ダウンロード版）とかを除外。
        isAlready[result[:provider_id]] = true

				result[:price] = row.css("span.price").text.gsub("価格：", "").gsub(/円.*$/, "").to_i

        # ジャンルとタイトルと発売元と画像取るために
        # 個別ページまで潜る。

        game_html = get game_url
        game_doc = Nokogiri::HTML.parse game_html

        result[:title] = game_doc.css("h1").css("span").text
        img_src = game_doc.css("span.preview").css("img").attr("src").text
        img_src = nil if img_src == "img/img.gif"
				result[:photo_url] = img_src
				result[:tags] = [game_doc.css("dl.genre").css("dd").text]
        result[:maker] = game_doc.css("dt.maker")[0].next_element.text

				Game.create_from_scraping result
			end
		end
	end
end
