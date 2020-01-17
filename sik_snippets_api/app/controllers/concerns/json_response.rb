module JsonResponse
  def json_response(object, message, status = :ok)
    render json: { message: message, data: object }, status: status
  end
end
