require 'RMagick'

module CostomUpload
  extend ActiveSupport::Concern

  module ClassMethods
    def file_upload(file, type, clip = {})
      name  = file.original_filename
      perms = [".jpg", ".jpeg", ".gif", ".png"]
      if perms.include?(File.extname(name).downcase) && file.size < 1.megabyte
        photo_path = self.generate("alphabet", 10) + name
        File.open("public/#{type}_photos/#{photo_path}", "wb") do |f|
          f.write(file.read)
        end

        case type
        when "user"
          file = Magick::Image.read("public/#{type}_photos/#{photo_path}").first.crop(clip[:width], clip[:height], 200, 200)
          file.write("public/#{type}_photos/#{photo_path}")
        end

        photo_path
      end
    end

    def url_upload(url, type, clip = {})
      case url
      when /png/
        extname = ".png"
      when /jpg|jpeg/
        extname = ".jpg"
      when /gif/
        extname = ".gif"
      end

      name       = self.generate("alphabet", 10)
      photo_path = "#{name}#{extname}"
      File.open("public/#{type}_photos/#{photo_path}", "wb") do |f|
        url = url.sub(/^.*,/, '')
        f.write(Base64.decode64(url))
      end

      case type
      when "user"
        file = Magick::Image.read("public/#{type}_photos/#{photo_path}").first.crop(clip[:x], clip[:y], 200, 200)
        file.write("public/#{type}_photos/#{photo_path}")
      end

      photo_path
    end
  end
end