class Status < ActiveRecord::Base
	has_many :logs
end
