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
    this.clearEditor()

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
    deleteIcon.classList.add('Button')
    deleteIcon.classList.add('SnippetDelete')
    deleteIcon.classList.add('Delete')
    snippetListItem.appendChild(deleteIcon)
    snippetList.appendChild(snippetListItem)

    const snippetSave = document.querySelector('.EditorColumn-save')
    // const deleteSnippet = document.querySelector('.SnippetDelete')

    snippetSave.addEventListener('click', (e) => {
      e.preventDefault()
      this.saveSnippetContent()
    })

    snippetList.addEventListener('click', () => {
      this.clearEditor()
    })

    deleteIcon.addEventListener('click', e => {
      this.delete(e)
      this.clearEditor()
    })
  }

  saveSnippetContent() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    const snippetContent = editor.value
    const userId = appState["currentUser"]["userId"]
    const categoryId = appState["selectedCategory"]["categoryId"]
    const snippetId = appState["selectedSnippet"]["snippetId"]
    const snippetTitle = appState["selectedSnippet"]["snippetTitle"]

    const data = {
      title: snippetTitle,
      body: snippetContent,
      snippet_category_id: categoryId
    }

    const configObject = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data)
    }

    fetch(`${app.baseUrl}users/${userId}/snippet_categories/${categoryId}/snippets/${snippetId}`, configObject)
      .then(() => {
        const snippetList = document.querySelector('.SnippetColumn-snippetList')
        const snippetCategoryList = document.querySelector('.CategoryColumn-categoryList')

        this.clearList(snippetList)
        this.clearList(snippetCategoryList)
        this.clearEditor()

        const categoryId = appState["selectedCategory"]["categoryId"]
        appState["currentUser"].fetchAndLoadSnippetCategories(categoryId)
        appState["currentUser"].fetchAndLoadSnippets(categoryId)
      })
      .catch(error => console.log(error.message))
  }

  clearEditor() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    editor.value = ""
  }

  clearList(element) {
    while (element.firstChild) {
      element.firstChild.remove()
    }
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
