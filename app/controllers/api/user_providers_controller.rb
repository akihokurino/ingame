class Api::UserProvidersController < ApplicationController
  before_action :set_user_provider, only: [:update]

  def update
    @result = @user_provider.update user_provider_params ? true : false
  end

  private
  def user_provider_params
    params.require(:user_provider).permit :share_log_status
  end

  def set_user_provider
    @user_provider = @current_user.user_providers.find_by service_name: params[:service_name]
  end
end
