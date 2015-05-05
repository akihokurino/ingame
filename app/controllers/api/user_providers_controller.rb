class Api::UserProvidersController < ApplicationController
  before_action :set_user_provider, only: [:update]

  def update
    params[:user_provider][:share_log_status] = params[:user_provider][:share_log_status] == "true" ? true : false
    @result = @user_provider.update share_log_status: user_provider_params[:share_log_status]  ? true : false
  end

  private
  def user_provider_params
    params.require(:user_provider).permit :share_log_status
  end

  def set_user_provider
    @user_provider = UserProvider.find params[:id]
  end

  def set_user_provider_by_service_name
    @user_provider = @current_user.user_providers.find_by service_name: params[:service_name]
  end
end
