namespace :wiki do
  desc "scraping from wiki"
  task :get => :environment do
    require 'open-uri'
    require 'nokogiri'
    require 'kconv'

    def get_detail(url)
      begin
        html = open(url){|f| f.read }
      rescue Exception
        return false
      end

      begin
        doc  = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
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
        return false
      end
    end

    Game.where(provider: "famituu", wiki: nil).each do |game|
      game_title = game[:title].strip.gsub(" ", "_")
      url        = "http://ja.wikipedia.org/wiki/#{game_title}"

      begin
        wiki = get_detail URI.parse(URI.encode(url))
      rescue Exception
        next
      end

      if wiki
        game.update(wiki: wiki)
        p "#{game[:title]}にwikiを追加しました"
      else
        p "#{game[:title]}にwikiを追加できませんでした"
      end
    end
  end
end