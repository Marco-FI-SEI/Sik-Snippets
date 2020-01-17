class Api::v1::SnippetCategoriesController < ApplicationController
  before_action :set_snippet_category, only: [:show, :update, :destroy]

  def index
    @snippet_categories = SnippetCategory.all
    json_response(@snippet_categories, "SUCCESS")
  end

  def create
    @snippet_category = SnippetCategory.create!(snippet_category_params)
    json_response(@snippet_category, "Snippet Category saved!", :created)
  end

  def show
    json_response(@snippet_category, "SUCCESS")
  end

  def update
    @snippet_category.update(snippet_category_params)
    head :no_content
  end

  def destroy
    @snippet_category.destroy
    head :no_content
  end

  private

  def set_snippet_category
    @snippet_category = SnippetCategory.find(params[:id])
  end

  def snippet_category_params
    params.permit(:title)
  end
end
