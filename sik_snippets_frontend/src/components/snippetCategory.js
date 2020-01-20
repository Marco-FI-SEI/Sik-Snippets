class SnippetCategory {
  constructor(id, title, owner) {
    this.id = id
    this.title = title
    this.owner = owner
    this.adapter = new SnippetAdapter(id, owner)
    // SnippetCategory.instanceCount = (SnippetCategory.instanceCount || 0) + 1
    this.renderCategoryList()
  }

  renderCategoryList() {
    const snippetCategoryList = document.querySelector('.CategoryColumn-categoryList')
    const snippetCategoryListItem = document.createElement('li')
    snippetCategoryListItem.classList.add('ListItem')
    snippetCategoryListItem.id = `sc-${this.id}`
    const listItemTitle = document.createElement('p')
    listItemTitle.classList.add('CategoryListItemTitle')
    const listItemTitleText = document.createTextNode(`${this.title}`)
    listItemTitle.appendChild(listItemTitleText)
    snippetCategoryListItem.appendChild(listItemTitle)
    const deleteIcon = document.createElement('i')
    deleteIcon.id = `${this.id}`
    deleteIcon.classList.add('far')
    deleteIcon.classList.add('fa-trash-alt')
    deleteIcon.classList.add('Delete')
    snippetCategoryListItem.appendChild(deleteIcon)
    snippetCategoryList.appendChild(snippetCategoryListItem)

    deleteIcon.addEventListener('click', e => {
      this.delete(e)
    })
  }

  delete(e) {
    const categoryId = e.target.id
    console.log(categoryId)

    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }

    fetch(`${app.baseUrl}users/${this.owner}/snippet_categories/${categoryId}`, configObject)
      .then(() => e.target.parentElement.remove())
      .catch(error => console.log(error.message))
  }
}
