namespace :steam do
	desc "scraping from steam"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'

    # デバイス名の変更
    def device_rename(old)
      device_table = {'3do' => '3DO', '3ds' => '3DS', 'ac' => 'AC', 'browser' => 'Web', 'dc' => 'DC', 'etc' => 'ETC', 'fc' => 'FC', 'gb' => 'GB', 'gba' => 'GBA', 'gc' => 'GC', 'gg' => 'GG', 'iphone' => 'iPhone', 'linux' => 'Linax', 'mac' => 'Mac', 'md' => 'MD', 'mk3' => 'SegaMK3', 'msx' => 'MSX', 'n64' => 'N64', 'nds' => 'NDS', 'ng' => 'NG', 'ngp' => 'NGP', 'pc' => 'PC', 'pc8801' => 'PC8801', 'pce' => 'PCE', 'pcfx' => 'PC-FX', 'ps' => 'PS', 'ps2' => 'PS2', 'ps3' => 'PS3', 'ps4' => 'PS4', 'psm' => 'PSM', 'psp' => 'PSP', 'psv' => 'PSV', 'sfc' => 'SFC', 'ss' => 'SS', 'steamplay' => 'STEAMPLAY', 'wii' => 'Wii', 'wiiu' => 'Wii U', 'win' => 'Windows', 'winmac' => 'WinMac', 'ws' => 'WS', 'x360' => 'Xbox360', 'xbox' => 'Xbox', 'xboxone' => 'XboxOne'}
      return (device_table[old] or old)
    end
    # なんとなくここで、連続アクセスではじかれた時用の処理しとく。
    def get(url)
      # url開いてソースを文字列で返す。
      html   = nil
      status = nil
      for i in 1..5
        open(url){|f|
          html   = f.read
          status = f.status[0].to_i
        }
        if status == 200
          return html
        else
          sleep i
        end
      end
      puts "ERROR! [status:#{status}] #{url}"
      exit 1
    end
		def search(i)
			#日本語、リリース日降順、ゲームのみ。約3000件。
			url = "http://store.steampowered.com/search/?l=japanese&sort_by=Released&sort_order=DESC&category1=998&page=#{i}"
			return get url
		end

    # スクレイピングルール。
    # 1. ゲームリストの1ページ目から順に見てく
    # 2. ゆえに、IDとrelease_dayは相関しない
    # 3. 既に登録済みのゲームが5つ出現したらexit 0
    # 4. 探してるページにゲームが一つも載ってなかったらexit 0
    i             = 0
    already_count = 0
    while true
      i  += 1
			doc = Nokogiri::HTML.parse(search i)
			searchResults = doc.css("a.search_result_row")
			if searchResults.length == 0
        puts "This is the end of steam game lists. XD"
        exit 0
      end
			searchResults.each do |row|
        if already_count >= 5
          puts "5 games are already exists in our database XD"
          exit 0
        end
				result               = {}
        result[:provider]    = "steam"
        result[:provider_id] = row.attributes["href"].text.gsub(/^.*\/app\//, '').gsub(/\/.*$/, '').to_i
				result[:title]       = row.css("span.title").text
				# result[:devices]     = row.css("span.platform_img").map {|span| device_rename(span["class"].split[1])}
        result[:devices]     = ["PC"]
				result[:release_day] = row.css("div.search_released").text.gsub(/[年月]/, "-").gsub("日", "")
				result[:price]       = ((tmp = row.css("div.search_price").children[-1]) and tmp.text).gsub("¥ ", "").gsub(",", "").gsub(/\s*/, '').to_i
				result[:photo_url]   = row.css("div.search_capsule > img")[0].attributes["src"].value.gsub(/\?.*/, "").gsub('capsule_sm_120', 'header')

        if Game.find_by provider: "steam", provider_id: result[:provider_id]
          puts "This is already exists #{result[:title]} from [#{result[:provider]}]"
          already_count += 1
          next
        end

        # tagsとpublisher取るために潜る。これらをあきらめるともっと速い。
        game_url              = row.attributes["href"].text + "&l=japanese"
        result[:provider_url] = game_url
        game_html             = get game_url
        # result[:game_html]    = game_html.toutf8
        result[:game_html]    = nil
        game_html_lines       = game_html.split
        game_dom              = Nokogiri::HTML.parse game_html
				result[:tags]         = game_dom.css("a.app_tag").map {|a| a.text.gsub /\s/, ""}
        maker                 = game_html_lines.grep(/store.steampowered.com\/publisher\//)[0]

        result[:game_urls]    = []
        game_dom.css("a.linkbar").each do |node|
          if node.children.text =~ /Web サイトにアクセス/
            result[:game_urls] << node.attributes["href"].value
            break
          end
        end

        unless maker
          maker = game_html_lines.grep(/store.steampowered.com\/search\/\?developer/)[0]
        end

        if maker
          result[:maker] = maker.gsub(/^[^>]*>/, '').gsub(/<.*$/, '')
        else
          result[:maker] = ""
        end

				unless Game.create_from_scraping result
          already_count += 1
        end
			end
		end
	end
end
