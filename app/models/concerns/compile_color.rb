require 'RMagick'

module CompileColor
  extend ActiveSupport::Concern

  class Compiler
    RATE_MIN = 0.05

    def initialize(img_path)
      @img      = Magick::Image.read(img_path).first
      @px_x     = @img.columns
      @px_y     = @img.rows
      @px_total = @px_x * @px_y
    end

    def compile_histogram
      begin
        img_depth = @img.depth
        hist      = @img.color_histogram.inject({}) do |hash, key_val|
          color         = key_val[0].to_color Magick::AllCompliance, false, img_depth, true
          hash[color] ||= 0
          hash[color]  += key_val[1]
          hash
        end

        @hist = hist.sort{ |a, b| b[1] <=> a[1] }
      rescue => e
        STDERR.puts "[ERROR][#{self.class.name}.compile] #{e}"
        exit 1
      end
    end

    def most_used_color
      @hist.first[0]
    end

    def display_histogram
      begin
        @hist.each do |color, count|
          rate = (count / @px_total.to_f) * 100
          break if rate < RATE_MIN
          puts "#{color} => #{count} px ( #{sprintf("%2.4f", rate)} % )"
        end
        puts
        puts "Image Size: #{@px_x} px * #{@px_y} px"
        puts "TOTAL     : #{@px_total} px, #{@hist.size} colors"
      rescue => e
        STDERR.puts "[ERROR][#{self.class.name}.display] #{e}"
        exit 1
      end
    end
  end
end