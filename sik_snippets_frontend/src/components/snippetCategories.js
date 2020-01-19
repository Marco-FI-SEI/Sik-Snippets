class SnippetCategories {
  constructor() {
    this.snippetCategories = []
    this.adapter = new SnippetCategoriesAdapter()
    this.fetchAndLoadSnippetCategories()
  }

  fetchAndLoadSnippetCategories() {
    this.adapter.getSnippetCategories()
      .then(snippetCategories => {
        snippetCategories.forEach(snippetCategory => {
          this.snippetCategories.push(new SnippetCategory(snippetCategory))
        })
        .then(() => this.render())
        .catch(error => console.log(error.message))
      })
  }
}
