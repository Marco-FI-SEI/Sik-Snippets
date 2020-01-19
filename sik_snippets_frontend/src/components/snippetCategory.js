class SnippetCategory {
  constructor(title, owner) {
    this.title = title
    this.owner = owner
    SnippetCategory.instanceCount = (SnippetCategory.instanceCount || 0) + 1
  }

  render() {
    const snippetCategoryList = document.querySelectorAll('.CategoryColumn-snippetCategoryList')
    const snippetCategoryListItem = document.createElement('li')
    snippetCategoryListItem.classList.add('CategoryColumn-snippetCategoryListItem')
    snippetCategoryListItem.id = `${this.getInstanceCount}`
    const listItemTitle = document.createElement('p')
    const listItemTitleText = `${this.title}`
    listItemTitle.appendChild(listItemTitleText)
    snippetCategoryListItem.appendChild(listItemTitle)
    const deleteIcon = document.createElement('i')
    deleteIcon.id = `${this.getInstanceCount}`
    deleteIcon.classList.add('far fa-trash-alt Delete')
    snippetCategoryListItem.appendChild(deleteIcon)
    snippetCategoryList.appendChild(snippetCategoryListItem)

    snippetCategoryListItem.addEventListener('click', (e) => {
      if (e.target.className === 'delete') this.delete(e)
    })
  }

  delete(e) {
    const categoryId = e.target.id

    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }

    fetch(`http://localhost:3000/api/v1/snippet_categories/${categoryId}`, configObject)
      .then(response => response.json())
      .then(json => console.log(json))
      .then(() => e.target.parentElement.remove())
      .catch(error => console.log(error.message))
  }
}

