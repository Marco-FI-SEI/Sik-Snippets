class SnippetAdapter {
  constructor(snippetCategoryId, userId) {
    this.snippetCategoryId = snippetCategoryId
    this.userId = userId
  }

  async getSnippets() {
    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${this.snippetCategoryId}/snippets`)
      .then(result => result.json())
      .catch(error => error.message)
  }

  async createSnippet(title, body = "") {
    const snippetData = {
      title: title,
      body: body,
      snippet_category_id: this.snippetCategoryId
    }

    const configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(snippetData)
    }

    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${this.snippetCategoryId}/snippets`, configObject)
      .then(result => result.json())
      .catch(error => error.message)
  }

  async getSnippetBody(id) {
    return fetch(`${app.baseUrl}users/${this.userId}/snippet_categories/${this.snippetCategoryId}/snippets/${id}`)
      .then(result => result.json())
      .catch(error => error.message)
  }
}
