namespace :steam do
	desc "scraping from steam"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'

    # なんとなくここで、連続アクセスではじかれた時用の処理しとく。
    def get(url)
      # url開いてソースを文字列で返す。
      html = nil
      status = nil
      for i in 1..5
        open(url){|f|
          html = f.read
          status = f.status[0].to_i
        }
        if status == 200
          return html
        else
          sleep i
        end
      end
      warn "[status:#{status}] #{url}"
      exit 1
    end
		def search(i)
			#日本語、リリース日降順、ゲームのみ。約3000件。
			url = "http://store.steampowered.com/search/?l=japanese&sort_by=Released&sort_order=DESC&category1=998&page=#{i}"
			return get url
		end
		for i in 1..1#1000
			doc = Nokogiri::HTML.parse(search i)
			searchResults = doc.css("a.search_result_row")
			break if searchResults.length == 0
			searchResults.each do |row|
				result = {}
        result[:provider] = "steam"
        result[:provider_id] = row.attributes["href"].text.gsub(/^.*\/app\//, '').gsub(/\/.*$/, '').to_i
				result[:title] = row.css("span.title").text
				result[:devices] = row.css("span.platform_img").map {|span| span["class"].split[1]}
				result[:release_day] = row.css("div.search_released").text.gsub(/[年月]/, "-").gsub("日", "")
				result[:price] = ((tmp = row.css("div.search_price").children[-1]) and tmp.text).gsub("¥ ", "").gsub(",", "").gsub(/\s*/, '').to_i
				result[:photo_url] = row.css("div.search_capsule > img")[0].attributes["src"].value.gsub(/\?.*/, "").gsub('capsule_sm_120', 'header')

        # tagsとpublisher取るために潜る。これらをあきらめるともっと速い。
        game_url = row.attributes["href"].text + "&l=japanese"
        game_html = get(game_url)
        game_html_lines = game_html.split

        game_dom = Nokogiri::HTML.parse(game_html)
				result[:tags] = game_dom.css("a.app_tag").map {|a| a.text.gsub /\s/, ""}

        maker = game_html_lines.grep(/store.steampowered.com\/publisher\//)[0]
        unless maker
          maker = game_html_lines.grep(/store.steampowered.com\/search\/\?developer/)[0]
        end
        result[:maker] = maker.gsub(/^[^>]*>/, '').gsub(/<.*$/, '')

				Game.create_from_scraping result
			end
		end
	end
end
