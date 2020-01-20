class SnippetCategoryAdapter {
  constructor(userId) {
    this.userId = userId
  }

  async getSnippetCategories() {
    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories`)
             .then(result => result.json())
             .catch(error => error.message)
  }

  async createSnippetCategory(titleValue, ownerValue) {
    const snippetCategoryData = {
      title: titleValue,
      owner: ownerValue
    }

    const configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(snippetCategoryData)
    }

    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories`, configObject)
            .then(result => result.json())
            .catch(error => error.message)
  }
}
