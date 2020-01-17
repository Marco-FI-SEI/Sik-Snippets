class Api::v1::SnippetsController < ApplicationController
  before_action :set_snippet_category
  before_action :set_snippet, only: [:show, :update, :destroy]

  def index
    json_response(@snippet_category.snippets, "SUCCESS")
  end

  def create
    @snippet_category.snippets.create!(snippet_params)
    json_response(@snippet_category, "Snippet Category saved!", :created)
  end

  def show
    json_response(@snippet, "SUCCESS")
  end

  def update
    @snippet.update(snippet_params)
    head :no_content
  end

  def destroy
    @snippet.destroy
    head :no_content
  end

  private

  def set_snippet_category
    @snippet_category = SnippetCategory.find(params[:snippet_category_id])
  end

  def set_snippet
    @snippet = @snippet_category.snippets.find_by!(id: params[:id]) if @snippet_category
  end

  def snippet_params
    params.permit(:title, :body)
  end
end
