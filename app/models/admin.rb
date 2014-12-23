class Admin < ActiveRecord::Base
  require 'digest/sha2'

  def collect_password?(password)
    self.class.crypt_password(password, self.salt.to_s) == self.password
  end

  class << self
    def create_with_password(admin_params)
      self.create_password admin_params
      self.create admin_params
    end

    def create_password(admin_params)
      admin_params[:salt]     = self.new_salt
      admin_params[:password] = self.crypt_password(admin_params[:password], admin_params[:salt].to_s)
    end

    def crypt_password(password, salt)
      Digest::SHA2.hexdigest(password + salt)
    end

    def new_salt
      s = rand.to_s.tr('+', '.')
      s[0, if s.size > 32 then 32 else s.size end]
    end

    def authenticate(username, password)
      admin = self.find_by(username: username)
      if admin && admin.collect_password?(password)
        admin
      else
        false
      end
    end
  end
end
