module CostomUpload
  extend ActiveSupport::Concern

  module ClassMethods
    def file_upload(file, type)
      name  = file.original_filename
      perms = [".jpg", ".jpeg", ".gif", ".png"]
      if perms.include?(File.extname(name).downcase) && file.size < 1.megabyte
        photo_path = self.generate("alphabet", 10) + name
        File.open("public/#{type}_photos/#{photo_path}", "wb") do |f|
          f.write(file.read)
        end

        photo_path
      end
    end

    def url_upload(url, type)
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

      photo_path
    end
  end
end