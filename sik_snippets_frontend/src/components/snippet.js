class Snippet {
  constructor(id, title, body = "", snippet_category_id) {
    this.id = id
    this.title = title
    this.body = body
    this.snippet_category_id = snippet_category_id
    this.renderSnippetList()
  }

  renderSnippetList() {
    const snippetList = document.querySelector('.SnippetColumn-snippetList')
    const snippetListItem = document.createElement('li')
    snippetListItem.classList.add('ListItem')
    snippetListItem.id = `s-${this.id}`
    const listItemTitle = document.createElement('p')
    const listItemTitleText = document.createTextNode(`${this.title}`)
    listItemTitle.appendChild(listItemTitleText)
    snippetListItem.appendChild(listItemTitle)
    const deleteIcon = document.createElement('i')
    deleteIcon.id = `${this.id}`
    deleteIcon.classList.add('far')
    deleteIcon.classList.add('fa-trash-alt')
    deleteIcon.classList.add('Delete')
    snippetListItem.appendChild(deleteIcon)
    snippetList.appendChild(snippetListItem)

    deleteIcon.addEventListener('click', e => {
      this.delete(e)
    })
  }

  delete(e) {
    const snippetId = e.target.id

    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }

    const currentUserId = appState["currentUser"]["userId"]

    fetch(`${app.baseUrl}users/${currentUserId}/snippet_categories/${this.snippet_category_id}/snippets/${snippetId}`, configObject)
      .then(() => e.target.parentElement.remove())
      .catch(error => console.log(error.message))
  }
}
