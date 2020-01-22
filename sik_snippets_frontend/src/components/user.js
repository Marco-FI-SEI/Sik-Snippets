class User {
  constructor(userId, firstName, email, isLoggedIn = true) {
    this.userId = userId
    this.firstName = firstName
    this.email = email
    this.isLoggedIn = isLoggedIn
    this.renderUserProfile()
    this.categoryAdapter = new SnippetCategoryAdapter(userId)
    this.fetchAndLoadSnippetCategories()
    this.initAndBindEventListeners()
  }

  renderUserProfile() {
    const viewContainer = document.querySelector('.Container')
    const landingView = document.querySelector('.Info')
    landingView.classList.add('Hide')
    const activeViewHtml = `
      <div class="Profile">
        <div class="Sidebar">
          <i class="fas fa-book fa-3x Sidebar-book Button"></i>
        </div>
        <div class="CategoryColumn Column Hide">
          <div class="CategoryColumn-columnHeader ColumnHeader">
            <input type="text" class="CategoryColumn-categoryInput ColumnInput" placeholder="Add Category">
            <i class="far fa-plus-square fa-3x Add AddCategory Button"></i>
          </div>
          <ul class="CategoryColumn-categoryList List"></ul>
        </div>
        <div class="SnippetColumn Column Hide">
          <div class="SnippetColumn-columnHeader ColumnHeader">
            <input type="text" class="SnippetColumn-snippetInput ColumnInput" placeholder="Add Snippet" disabled>
            <i class="far fa-plus-square fa-3x Add AddSnippet Button"></i>
          </div>
          <ul class="SnippetColumn-snippetList List"></ul>
        </div>
        <div class="EditorColumn">
          <h2 class="EditorColumn-header"></h2>
          <div class="EditorColumn-Editor">
            <textarea class="EditorColumn-editorArea" disabled></textarea>
            <button type="submit" class="EditorColumn-save Button Primary">Save</button>
          </div>
        </div>
      </div>
    `

    viewContainer.insertAdjacentHTML('afterbegin', activeViewHtml)
  }

  fetchAndLoadSnippetCategories() {
    this.categoryAdapter.getSnippetCategories()
      .then(snippetCategoriesData => {
        const obj = snippetCategoriesData.data.object
        if (obj.length > 0) {
          obj.forEach(snippetCategory => {
            const {
              id,
              title,
              owner
            } = snippetCategory
            new SnippetCategory(id, title, owner)
          })
        }
      })
      .catch(error => console.log(error.message))
  }

  fetchAndLoadSnippets(snippetCategoryId) {
    const adapter = new SnippetAdapter(snippetCategoryId, this.userId)
    adapter.getSnippets()
      .then(snippetsData => {
        const obj = snippetsData.data.object
        if (obj.length > 0) {
          obj.forEach(snippet => {
            const {
              id,
              title,
              body,
              snippet_category_id
            } = snippet
            new Snippet(id, title, body, snippet_category_id)
          })
        }
      })
      .catch(error => console.log(error.message))
  }

  initAndBindEventListeners() {
    const addButtons = document.querySelectorAll('.Add')
    const lists = document.querySelectorAll('.List')
    const accountButton = document.querySelector('.AccountButton')
    const snippetBook = document.querySelector('.Sidebar-book')
    const inputs = document.querySelectorAll('.ColumnInput')

    accountButton.classList.remove('Hide')

    snippetBook.addEventListener('click', () => {
      this.toggleColumnDisplay()
      this.clearEditor()
    })

    accountButton.addEventListener('click', () => {
      this.logUserOut()
      accountButton.classList.add('Hide')
    })

    inputs.forEach(input => {
      input.addEventListener('click', e => {
        if (e.target.className.includes('Category')) {
          this.removeAllSelections("Category", e)
        } else {
          this.removeAllSelections("Snippet", e)
        }

        this.clearEditor()
      })
    })

    addButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.target.className.includes('Category')) {
          this.addSnippetCategory(e)
        } else {
          this.addSnippet(e)
        }
      })
    })

    lists.forEach(list => {
      list.addEventListener('click', e => {
        const id = e.target.parentNode.id.split("-")[1]

        if (e.target.className.includes('CategoryListItemTitle')) {
          if (Object.keys(appState["selectedSnippet"]).length > 0) {
            appState["selectedSnippet"] = {}
            this.clearEditor()
          }
          const snippetList = document.querySelector('.SnippetColumn-snippetList')
          this.clearList(snippetList)
          this.fetchAndLoadSnippets(id)
          this.toggleColumnDisplay("category")
          this.displaySelected("category", e)
        } else if (e.target.className.includes('SnippetListItemTitle')) {
          this.displaySelected("snippet", e)
          this.renderSnippetBody(id)
        }

        this.clearEditor()
      })
    })
  }

  removeAllSelections(item, e) {
    let list

    if (item === "Category") {
      // find and remove the selected item in both lists
      list = document.querySelector('.SnippetColumn-snippetList').childNodes

      for (const item of list) {
        if (item.className.includes('Selected')) {
          item.classList.remove('Selected')
        }
      }
      list = document.querySelector('.CategoryColumn-categoryList').childNodes

      for (const item of list) {
        if (item.className.includes('Selected')) {
          item.classList.remove('Selected')
        }
      }
      // remove selection from appState
      appState["selectedSnippet"] = {}
      appState["selectedCategory"] = {}
    } else {
      // find and remove the selected item in snippet list
      list = document.querySelector('.SnippetColumn-snippetList').childNodes

      for (const item of list) {
        if (item.className.includes('Selected')) {
          item.classList.remove('Selected')
        }
      }
      // remove selection from appState
      appState["selectedSnippet"] = {}
    }
  }

  displaySelected(item, e) {
    let id = e.target.parentNode.id.split("-")[1]
    let element
    let obj
    let keyId
    let keyName
    let list
    const fn = this.setInputStatus

    if (item === "category") {
      element = document.getElementById(`sc-${id}`)
      obj = "selectedCategory"
      keyId = "categoryId"
      keyName = "categoryTitle";
      list = document.querySelector('.CategoryColumn-categoryList')
    } else if (item === "snippet") {
      element = document.getElementById(`s-${id}`)
      obj = "selectedSnippet"
      keyId = "snippetId"
      keyName = "snippetTitle";
      list = document.querySelector('.SnippetColumn-snippetList')
    }
    // check if selection exists
    if (Object.keys(appState[obj]).length > 0) {
      // check if selection is the same
      if (appState[obj][keyId] === id) {
        // selection exists and is the same
        element.classList.toggle('Selected')
        appState[obj] = {}
        fn(keyName)
      } else {
        // selection exists and is not the same
        const previousSelection = list.querySelector('.Selected')
        previousSelection.classList.remove('Selected')
        element.classList.add('Selected')
        appState[obj][keyId] = id
        appState[obj][keyName] = e.target.parentNode.textContent
        fn(keyName, "enable")
      }
    } else {
      // selection does not exist
      element.classList.add('Selected')
      appState[obj][keyId] = id
      appState[obj][keyName] = e.target.parentNode.textContent
      fn(keyName, "enable")
    }
    console.log(appState)
  }

  setInputStatus(keyName, status = "disabled") {
    let input

    if (keyName === "categoryTitle") {
      input = document.querySelector('.SnippetColumn-snippetInput')
    } else {
      input = document.querySelector('.EditorColumn-editorArea')
    }
    if (status === "enable") {
      input.removeAttribute("disabled")
    } else {
      input.setAttribute("disabled", "")
    }
  }

  clearList(element) {
    while (element.firstChild) {
      element.firstChild.remove()
    }
  }

  addSnippetCategory(e) {
    const title = e.target.previousElementSibling.value
    const owner = appState["currentUser"]["userId"]
    this.categoryAdapter.createSnippetCategory(title, owner).then(snippetCategoryData => {
        const {
          id,
          title,
          owner
        } = snippetCategoryData.data.object
        new SnippetCategory(id, title, owner)
      })
      .catch(error => error.message)
    e.target.previousElementSibling.value = ""
  }

  addSnippet(e) {
    const snippetCategory = appState["selectedCategory"]["categoryId"]
    const snippetAdapter = new SnippetAdapter(snippetCategory, this.userId)
    const snippetTitle = e.target.previousElementSibling.value
    snippetAdapter.createSnippet(snippetTitle).then(snippetData => {
        const {
          id,
          title,
          body,
          snippet_category_id
        } = snippetData.data.object
        new Snippet(id, title, body, snippet_category_id)
      })
      .catch(error => error.message)
    e.target.previousElementSibling.value = ""
  }

  renderSnippetBody(id) {
    const snippetCategory = appState["selectedCategory"]["categoryId"]
    const editor = document.querySelector('.EditorColumn-editorArea')
    const snippetAdapter = new SnippetAdapter(snippetCategory, this.userId)

    snippetAdapter.getSnippetBody(id).then(snippetData => {
      const body = snippetData.data.object.body
      editor.value = body
    })
  }

  toggleColumnDisplay(element = "snippetBook") {
    const categoryColumn = document.querySelector('.CategoryColumn')
    const snippetColumn = document.querySelector('.SnippetColumn')

    if (element === "snippetBook") {
      this.clearEditor()
      appState["selectedCategory"] = {}
      appState["selectedSnippet"] = {}
    }

    if (element === "category" && appState["isSnippetColumnVisible"] === false) {
      snippetColumn.classList.remove('Hide')
      appState["isSnippetColumnVisible"] = true
    } else if (appState["isCategoryColumnVisible"] === false) {
      categoryColumn.classList.remove('Hide')
      appState["isCategoryColumnVisible"] = true
    } else if (appState["isCategoryColumnVisible"] === true && appState["isSnippetColumnVisible"] === false) {
      categoryColumn.classList.add('Hide')
      appState["isCategoryColumnVisible"] = false
      appState["selectedCategory"] = {}
    } else if (element === "snippetBook" && appState["isCategoryColumnVisible"] === true && appState["isSnippetColumnVisible"] === true) {
      categoryColumn.classList.add('Hide')
      snippetColumn.classList.add('Hide')
      appState["isCategoryColumnVisible"] = false
      appState["isSnippetColumnVisible"] = false
      appState["selectedCategory"] = {}
      appState["selectedSnippet"] = {}
    }
  }

  logUserOut = () => {
    const configObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }

    fetch(`${baseUrl}logout`, configObject, {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(json => handleSession(json))
      .catch(error => console.log(error.message))

    appState = {
      ...app.state
    }
  }

  clearEditor() {
    const editor = document.querySelector('.EditorColumn-editorArea')
    editor.value = ""
  }
}

// marco@gmail.com
