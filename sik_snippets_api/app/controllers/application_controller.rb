class ApplicationController < ActionController::API
  include JsonExceptionHandler
  include JsonResponse
end
