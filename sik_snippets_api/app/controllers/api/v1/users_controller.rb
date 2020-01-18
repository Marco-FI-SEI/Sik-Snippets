class Api::V1::UsersController < ApplicationController

  def create
    @user = User.new(user_params)

    if @user.save!(user_params)
      session[:user_id] = @user.id
      json_response(object = @user, status = :created)
    else
      render json: { status: 500 }
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :email, :password, :password_confirmation)
  end
end
