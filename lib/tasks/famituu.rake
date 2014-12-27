require "date"

namespace :famituu do
	desc "scraping from famituu"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'
    require 'kconv'

    # デバイス名の変更
    def device_rename(old)
      device_table = {'3do' => '3DO', '3ds' => '3DS', 'ac' => 'AC', 'browser' => 'Web', 'dc' => 'DC', 'etc' => 'ETC', 'fc' => 'FC', 'gb' => 'GB', 'gba' => 'GBA', 'gc' => 'GC', 'gg' => 'GG', 'iphone' => 'iPhone', 'linux' => 'Linax', 'mac' => 'Mac', 'md' => 'MD', 'mk3' => 'SegaMK3', 'msx' => 'MSX', 'n64' => 'N64', 'nds' => 'NDS', 'ng' => 'NG', 'ngp' => 'NGP', 'pc' => 'PC', 'pc8801' => 'PC8801', 'pce' => 'PCE', 'pcfx' => 'PC-FX', 'ps' => 'PS', 'ps2' => 'PS2', 'ps3' => 'PS3', 'ps4' => 'PS4', 'psm' => 'PSM', 'psp' => 'PSP', 'psv' => 'PSV', 'sfc' => 'SFC', 'ss' => 'SS', 'steamplay' => 'STEAMPLAY', 'wii' => 'Wii', 'wiiu' => 'Wii U', 'win' => 'Windows', 'winmac' => 'WinMac', 'ws' => 'WS', 'x360' => 'Xbox360', 'xbox' => 'Xbox', 'xboxone' => 'XboxOne'}
      return (device_table[old] or old)
    end

    # url開いてソースを文字列で返す。
    def get(url)
      html   = nil
      status = nil
      # なんとなくここで、連続アクセスではじかれた時用の処理しとく。
      for i in 1..5
        begin
          open(url){|f|
            html = f.read
            return html
          }
        rescue => ex
          status = ex.io.status[0]
          if status == "404"
            return 404
          else
            sleep i
          end
        end
      end
      warn "[status:#{status}] #{url}"
      exit 1
    end

    def search_by_range(str, page)
      url = "http://www.famitsu.com/schedule/calendar/all/#{str}/#{page}/?kaigai=1"
			get url
    end

		def search(date, page)
      search_by_range "#{date.year}/#{date.month}/#{date.day}", page
		end

    def pageEnd(doc)
      ret = doc.css("div.pager > ul > li")
      if ret.length == 0
        ret = 1
      else
        ret = ret[-2].child.text.to_i
      end
    end

    # ある日付（年月日）のリストを根こそぎスクレイピングしてDBに保存する
    def scrape_date(date)
      doc = Nokogiri::HTML.parse search(date, 1)
      pageEnd(doc).downto 1 do |page|
        puts "collecting #{date} / #{page}"

        doc           = Nokogiri::HTML.parse search(date, page)
        searchResults = doc.css("div.itemJacketBox")
        break if searchResults.length == 0
        isAlready     = {}

        searchResults.each do |row|
          row                  = row.parent
          result               = {}
          result[:provider]    = "famituu"
          result[:release_day] = date.strftime("%Y-%m-%d")
          game_url             = nil
          devices              = []

          # デバイス,IDの取得
          row.css("div.gameTitle > a").each do |a|
            href = a.attr("href")
            if href.index("http://www.famitsu.com/cominy/")
              isGame               = true
              result[:provider_id] = href.gsub(/^.*title_id=/, '').to_i
              game_url             = href
            else
              name = href.gsub(/^.*calendar\//, '').gsub(/\/.*$/, '')
              devices << device_rename(name) unless name == "all"
            end
          end

          next if devices.length == 0
          result[:devices] = devices
          next unless game_url
          next if isAlready[result[:provider_id]] # （ダウンロード版）とかを除外。
          isAlready[result[:provider_id]] = true

          result[:price] = row.css("span.price").text.gsub("価格：", "").gsub(/円.*$/, "").to_i

          if Game.find_by provider: "famituu", provider_id: result[:provider_id], device: devices[0]
            puts "Already existing game (#{devices[0]}) from [#{result[:provider]}]"
            next
          end

          # ジャンルとタイトルと発売元と画像取るために
          # 個別ページまで潜る。
          game_html             = get game_url
          result[:game_html]    = game_html
          result[:provider_url] = game_url
          game_doc              = Nokogiri::HTML.parse game_html
          result[:title]        = game_doc.css("h1").css("span").text

          next if result[:title] == ""

          # 価格の取得
          game_doc.css("dl.gameData span").each do |node|
            if node.attributes["itemprop"].value == "price"
              result[:price] = node.children.text
              break
            end
          end

          img_src            = game_doc.css("span.preview").css("img").attr("src").text
          img_src            = nil if img_src == "img/img.gif"
          result[:photo_url] = img_src
          result[:tags]      = [game_doc.css("dl.genre").css("dd").text]
          begin
            result[:maker] = game_doc.css("dt.maker")[0].next_element.text
          rescue
            result[:maker] = ""
          end

          result[:game_urls] = []
          game_doc.css("#gameSummary .officialUrl dd a").each do |node|
            result[:game_urls] << node.attributes["href"].value
          end

          # ゲームのサムネイルが無い場合はアマゾンから拝借
          game_doc.css("ul#gameItemBox li").each do |node|
            node.css(".ecImages").children.each do |node|
              if node.name == "a"
                amazon_url          = node.attributes["href"].value
                result[:amazon_url] = amazon_url unless result[:amazon_url]
                result[:photo_url]  = scrape_from_amazon(amazon_url) unless result[:photo_url]
              end
            end

            break if result[:photo_url]
          end

          # ゲームのタイトルをキーにwikiから概要の取得
          game_title    = result[:title].strip.gsub(" ", "_")
          url           = "http://ja.wikipedia.org/wiki/#{game_title}"
          begin
            result[:wiki] = get_wiki URI.parse(URI.encode(url))
          rescue Exception
            result[:wiki] = nil
          end

          Game.create_from_scraping result
        end
      end
    end

    def get_wiki(url)
      begin
        html = open(url){|f| f.read }
      rescue Exception
        return nil
      end

      begin
        doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
        doc.css("#mw-content-text").each do |node|
          node.css('h2 span').each do |node|
            if node.children.text == "概要"
              target_node = node.parent.next
              text_array  = []
              while target_node.name != "h2" do
                if target_node.name == "p"
                  target_node.children.each do |node|
                    if node.name == "text"
                      text_array << node.text
                    end
                    if node.name == "a"
                      text_array << node.children.text
                    end
                  end
                end
                target_node = target_node.next
              end
              return text_array.join("")
            end
          end
        end
      rescue Exception
        return nil
      end
    end

    def scrape_from_amazon(url)
      result = {
        amazon_url: URI.unescape(url)
      }

      begin
        html = open(url, "User-Agent" => "Mozilla/4.0"){|f| f.read }
      rescue Exception
        return nil
      end

      begin
        doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
      rescue Exception
        return nil
      end

      photo_url = nil

      doc.css("#prodImageCell img").each do |node|
        photo_url = node.attributes["src"].value
      end

      photo_url
    end

    # 発売済みのソフトをスクレイピングする。
    # 1. DBに保存されている最新のゲームの発売日を基準点とする
    # 2. DBが空なら、基準点は1983/1/1である
    # 3. 基準点が今日を超えてたら、今日が基準点となる。
    # 4. 1983/-/-/?kaigai=1 とかをスクレイピングして、日付リストを取得
    # 5. 基準点以上の日付を月ごとに探索し、「今月」を超えたらEND
    def scrape
      pivot_date = nil
      today      = Date.today

      if Game.where(provider: "famituu").count == 0
        pivot_date = Date.parse("1987/1/1")
      else
        pivot_date = Game.where(provider: "famituu").order("release_day DESC").first.release_day
        pivot_date = today if pivot_date > today
      end

      current = pivot_date.change day: 1
      while current <= today
        puts "now collecting games on #{current}"

        doc          = search_by_range "#{current.year}/#{current.month}/-", 1
        next if doc == 404
        doc          = Nokogiri::HTML.parse doc
        already_date = {}

        # DOM構造が変わって最後のページ数が分からなくなった。
        # 一ヶ月に500本以上のゲームは発売されないと考え、10決め打ちでいく。
        # pageEnd(doc).downto 1 do |page|
        10.downto 1 do |page|
          html  = search_by_range("#{current.year}/#{current.month}/-", page)
          next if html == 404
          doc   = Nokogiri::HTML.parse html
          dates = doc.css("h2 > a").map do |a|
            a.text.gsub(/\s*/, "").gsub(/[年月]/, "-").gsub("日", "")
          end
          dates.reverse!
          for d in dates
            next if already_date[d]

            already_date[d] = 1
            scrape_date Date.parse d
          end
        end
        current = current.next_month
      end
    end

    scrape
  end
end
