namespace :steam do
	desc "scraping from steam"
	task :get => :environment do
		require 'open-uri'
		require 'nokogiri'
    def get(url)
      # url開いてソースを文字列で返す。
      html = open(url){|f| f.read}
      return html
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
				result[:title] = row.css("span.title").text
				result[:devices] = row.css("span.platform_img").map {|span| span["class"].split[1]}
				result[:released] = row.css("div.search_released").text
				result[:price] = ((tmp = row.css("div.search_price").children[-1]) and tmp.text).gsub("\t","").gsub("¥ ", "").gsub(",", "") # なぜか()を外すと動かないぞ。
				result[:image] = row.css("div.search_capsule > img")[0].attributes["src"].value.gsub(/\?.*/, "").gsub('capsule_sm_120', 'header')

        # tagsとpublisher取るために潜る。これらをあきらめるともっと速い。
        game_url = row.attributes["href"].text + "&l=japanese"
        game_html = get(game_url)
        game_html_lines = game_html.split

        game_dom = Nokogiri::HTML.parse(game_html)
				result[:tags] = game_dom.css("a.app_tag").map {|a| a.text.gsub /\s/, ""}

        publisher = game_html_lines.grep(/store.steampowered.com\/publisher\//)[0]
        unless publisher
          publisher = game_html_lines.grep(/store.steampowered.com\/search\/\?developer/)[0]
        end
        result[:publisher] = publisher.gsub(/^[^>]*>/, '').gsub(/<.*$/, '')

				p result
			end
		end
	end
end
