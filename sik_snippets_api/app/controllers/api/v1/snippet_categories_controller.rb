class Api::V1::SnippetCategoriesController < ApplicationController
  before_action :set_snippet_category, only: [:show, :update, :destroy]
  before_action :require_login

  def index
    @snippet_categories = SnippetCategory.all
    json_response(object: @snippet_categories)
  end

  def create
    @snippet_category = SnippetCategory.create!(title: params[:title])
    if @snippet_category
      json_response(object: @snippet_category, message: "Snippet Category saved!", status: :created)
    end
  end

  def show
    json_response(object: @snippet_category)
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
    params.require(:snippet_category).permit(:title)
  end
end
