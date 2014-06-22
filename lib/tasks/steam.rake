namespace :steam do
	desc "scraping from steam"
  task :get => :environment do
    require 'open-uri'
		require 'nokogiri'
    def search(i)
      #日本語、リリース日降順、ゲームのみ。約3000件。
      url = "http://store.steampowered.com/search/?l=japanese&sort_by=Released&sort_order=DESC&category1=998&page=#{i}"
      html = open(url){|f| f.read}
      return html
    end
    for i in 1..1#1000
      doc = Nokogiri::HTML.parse(search i)
      searchResults = doc.css("a.search_result_row")
      break if searchResults.length == 0
			searchResults.each do |row|
        result = {}
        result[:title] = row.css("h4").text
        result[:devices] = row.css("span.platform_img").map {|span| span["class"].split[1]}
        result[:released] = row.css("div.search_released").text
        result[:price] = row.css("div.search_price").children[-1].text
        result[:tags] = row.css("div.search_name > p").text.gsub(/ - .*$/, '').gsub(/リリース日:.*$/, '').gsub(/\s/,'').split(",")
        result[:image] = row.css("div.search_capsule > img")[0].attributes["src"].value.gsub(/\?.*/, "")
        p result
      end
    end
  end
end
