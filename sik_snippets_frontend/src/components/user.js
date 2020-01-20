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
          <i class="fas fa-book-medical fa-3x Sidebar-book"></i>
          <div class="AccountButton"><i class="fas fa-sign-out-alt fa-3x"></i></div>
        </div>
        <div class="CategoryColumn Column">
          <div class="CategoryColumn-columnHeader">
            <i class="far fa-plus-square fa-3x Add AddCategory"></i>
            <input type="text class="CategoryColumn-categoryInput" placeholder="Add Category">
          </div>
          <ul class="CategoryColumn-categoryList List"></ul>
        </div>
        <div class="SnippetColumn Column">
          <div class="SnippetColumn-columnHeader">
            <i class="far fa-plus-square fa-3x Add AddSnippet"></i>
            <input type="text class="SnippetColumn-snippetInput" placeholder="Add Snippet">
          </div>
          <ul class="SnippetColumn-snippetList List"></ul>
        </div>
        <div class="EditorColumn">
          <textarea class="EditorColumn-Editor"></textarea>
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
          this.fetchAndLoadSnippets(id)
          appState["selectedCategory"] = id
        }
        else {
          this.renderSnippetBody(id)
          appState["selectedSnippet"] = id
        }
      })
    })
  }

  addSnippetCategory(e) {
    const title = e.target.nextElementSibling.value
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
      e.target.nextElementSibling.value = ""
  }

  addSnippet(e) {
    const snippetCategory = appState["selectedCategory"]
    const snippetAdapter = new SnippetAdapter(snippetCategory, this.userId)
    const snippetTitle = e.target.nextElementSibling.value
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
      e.target.nextElementSibling.value = ""
  }

  renderSnippetBody(id) {
    const snippetCategory = appState["selectedCategory"]
    const editor = document.querySelector('.EditorColumn-Editor')
    const snippetAdapter = new SnippetAdapter(snippetCategory, this.userId)
    snippetAdapter.getSnippetBody(id).then(snippetData => {
      const body = snippetData.data.object.body
      editor.insertAdjacentHTML("afterbegin", body)
    })
  }
}

// marco@gmail.com
