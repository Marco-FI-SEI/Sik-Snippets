class SnippetCategoriesAdapter {
  constructor() {
    this.baseUrl = "http://localhost:3000/api/v1/snippet_categories"
  }

  getSnippetCategories() {
    return fetch(this.baseUrl).then(result => result.json())
  }
}
