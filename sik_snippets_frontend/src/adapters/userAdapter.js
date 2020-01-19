class UserAdapter {
  constructor(userId) {
    this.requestUrl = `http://localhost:3000/api/v1/users/${userId}/snippetCategories`
  }

  getSnippetCategories() {
    return fetch(this.baseUrl).then(result => result.json())
  }
}
