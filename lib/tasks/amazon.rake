namespace :amazon do
	desc "scraping from amazon"
  	task :get => :environment do
    	require 'open-uri'
		require 'nokogiri'
		require 'kconv'

		def get_detail(url)
			result = {
				amazon_url: URI.unescape(url)
			}

			begin
				html = open(url){|f| f.read }
			rescue Exception
				html = open(url, "r:binary").read.encode("utf-8", "euc-jp", invalid: :replace, undef: :replace)
			end

			begin
				doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
			rescue
				doc = Nokogiri::HTML.parse(html, nil)
			end

			doc.css("#btAsinTitle").each do |node|
				result[:title] = node.children.text
			end
			doc.css("#platform-information .byLinePipe").each do |node|
				result[:device] = node.next.text
			end
			doc.css(".parseasinTitle + a").each do |node|
				result[:maker] = node.children.text
			end
			doc.css("#prodImageCell img").each do |node|
				result[:photo_path] = node.attributes["src"].value
			end

			if Game.exists?(title: result[:title])
				p false
			else
				p Game.create(result)
			end
		end

		def crawl_amazon(url)
			begin
				html = open(url){|f| f.read }
			rescue Exception
				return
			end

			begin
				doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
			rescue
				doc = Nokogiri::HTML.parse(html, nil)
			end

			doc.css(".productTitle a").each do |node|
				get_detail(node.attributes["href"].value)
			end
			doc.css("#pagnNextLink").each do |node|
				if node.name == "a"
					crawl_amazon2(node.attributes["href"].value)
				end
			end
		end

		def crawl_amazon2(url)
			begin
				html = open(url){|f| f.read }
			rescue Exception
				return
			end

			begin
				doc = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
			rescue
				doc = Nokogiri::HTML.parse(html, nil)
			end

			doc.css("h3 a").each do |node|
				get_detail(node.attributes["href"].value)
			end
			doc.css("#pagnNextLink").each do |node|
				if node.name == "a"
					if node.attributes["href"].value.start_with?("http://www.amazon.co.jp")
						crawl_amazon2(node.attributes["href"].value)
					else
						crawl_amazon2("http://www.amazon.co.jp" + node.attributes["href"].value)
					end
				end
			end
		end

		#PS4
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_2494234051_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A2494234051%2Cn%3A2494235051&bbn=2494234051&ie=UTF8&qid=1403177798&rnid=2494234051")
		#PS3
		crawl_amazon("http://www.amazon.co.jp/s/ref=sr_pg_1?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A15782591%2Cn%3A2228410051&bbn=15782591&ie=UTF8&qid=1403140719")
		#PS2
		crawl_amazon("http://www.amazon.co.jp/s/ref=sr_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A637874%2Cn%3A2228409051&bbn=637874&ie=UTF8&qid=1403177762&rnid=637874")
		#PSP
		crawl_amazon("http://www.amazon.co.jp/s/ref=sr_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A13305031%2Cn%3A2228404051&bbn=13305031&ie=UTF8&qid=1403177835&rnid=13305031")
		#PS VITA
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_2280006051_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A2280006051%2Cn%3A2280007051&bbn=2280006051&ie=UTF8&qid=1403177883&rnid=2280006051")
		#Wii
		crawl_amazon("http://www.amazon.co.jp/s/ref=sr_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A193662011%2Cn%3A2228405051&bbn=193662011&ie=UTF8&qid=1403177913&rnid=193662011")
		#Wii U
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_2279943051_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A2279943051%2Cn%3A2279944051&bbn=2279943051&ie=UTF8&qid=1403177967&rnid=2279943051")
		#Nintendo DS
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_13305831_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A13305831%2Cn%3A2228408051&bbn=13305831&ie=UTF8&qid=1403177995&rnid=13305831")
		#Nintendo 3DS
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_2225588051_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A2225588051%2Cn%3A2228407051&bbn=2225588051&ie=UTF8&qid=1403178026&rnid=2225588051")
		#Xbox one
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_2540971051_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A2540971051%2Cn%3A2540972051&bbn=2540971051&ie=UTF8&qid=1403178086&rnid=2540971051")
		#Xbox 360
		crawl_amazon("http://www.amazon.co.jp/s/ref=lp_15783231_nr_n_0?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A15783231%2Cn%3A2228406051&bbn=15783231&ie=UTF8&qid=1403178118&rnid=15783231")
		#PC Game
		#crawl_amazon("http://www.amazon.co.jp/s/ref=sr_nr_n_12?rh=n%3A637394%2Cn%3A%21637872%2Cn%3A689132&bbn=637872&ie=UTF8&qid=1403509187&rnid=637872")
  	end
end
