class Api::V1::SessionsController < ApplicationController
  include CurrentUserConcern

  def create
    @user = User.find_by(email: params[:email]).try(:authenticate, params["password"])

    if @user
      session[:user_id] = @user.id
      json_response(object: @user, status: :created, logged_in: true)
    else
      render json: { status: 401 }
    end
  end

  def logged_in
    if @current_user
      json_response(object: @current_user, logged_in: true)
    else
      render json: { logged_in: false }
    end
  end

  def logout
    reset_session
    render json: { status: 200, logged_out: true }
  end
end
