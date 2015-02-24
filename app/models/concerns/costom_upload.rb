require 'RMagick'

module CostomUpload
  extend ActiveSupport::Concern

  module ClassMethods
    def file_upload(file, type, clip = {})
      name  = file.original_filename
      perms = [".jpg", ".jpeg", ".gif", ".png"]
      if perms.include?(File.extname(name).downcase) && file.size <= 3.megabyte
        photo_path = "#{DateTime.now.to_i}#{self.generate('alphabet', 10)}#{name}"
        File.open("public/#{type}_photos/#{photo_path}", "wb") do |f|
          f.write(file.read)
        end

        case type
        when "user", "tmp"
          file = Magick::Image.read("public/#{type}_photos/#{photo_path}").first.crop(clip[:x], clip[:y], 240, 240)
          file.write("public/#{type}_photos/#{photo_path}")
        end

        photo_path
      else
        raise "wrong extname or too big"
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
      else
        extname = nil
      end

      photo_path = "#{DateTime.now.to_i}#{self.generate('alphabet', 10)}#{extname}"
      File.open("public/#{type}_photos/#{photo_path}", "wb") do |f|
        url  = url.sub(/^.*,/, '')
        file = Base64.decode64 url

        if extname.nil? || file.size > 3.megabyte
          raise "wrong extname or too big"
        else
          f.write file
        end
      end

      case type
      when "user", "tmp"
        file = Magick::Image.read("public/#{type}_photos/#{photo_path}").first.crop(clip[:x], clip[:y], 240, 240)
        file.write("public/#{type}_photos/#{photo_path}")
      end

      photo_path
    end
  end
end