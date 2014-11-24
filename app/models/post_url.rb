class PostUrl < ActiveRecord::Base
  require 'open-uri'
  require 'nokogiri'
  require 'RMagick'
  require 'kconv'

  belongs_to :post

  class << self
    def create_thumbnail(url, post)
      html = open(url) do |f|
        charset = f.charset
        f.read
      end

      doc  = Nokogiri::HTML.parse(html.toutf8, nil, "UTF-8")
      data = {
        post_id: nil,
        title: nil,
        description: nil,
        thumbnail: nil
      }

      data[:post_id] = post[:id]
      data[:title]   = doc.title
      data[:url]     = url

      doc.css("meta").each do |meta|
        if meta.attributes["name"] && meta.attributes["name"].value == "description"
          data[:description] = meta.attributes["content"].value
        end
        if meta.attributes["property"] && meta.attributes["property"].value == "og:description"
          data[:description] = meta.attributes["content"].value
        end
        if meta.attributes["property"] && meta.attributes["property"].value == "og:image"
          data[:thumbnail] = meta.attributes["content"].value
        end
      end

      unless data[:thumbnail]
        images = doc.css("img")
        if images.present?
          proper_image = nil
          r            = Regexp.new("http")
          images.each do |image|
            url = image.attributes["src"].value if image.attributes["src"]
            if r =~ File.dirname(url)
              rm_image = Magick::ImageList.new(url)
              begin
                if rm_image.columns >= 100 && rm_image.rows >= 100
                  proper_image = image
                  break
                end
              rescue
              end
            end
          end

          if proper_image.present?
            proper_image.attributes.each do |attribute|
              if attribute[0] == "src"
                data[:thumbnail] = attribute[1].value
                break
              end
            end
          end
        end
      end

      self.create data
    end
  end
end
