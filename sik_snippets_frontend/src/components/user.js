class User {
  constructor(userId, firstName, email, isLoggedIn = true) {
    this.userId = userId,
      this.firstName = firstName,
      this.email = email
    this.isLoggedIn = isLoggedIn
    this.renderUserProfile()
    this.adapter = new SnippetCategoryAdapter(userId)
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
        <div class="CategoryColumn">
          <div class="CategoryColumn-columnHeader">
            <i class="far fa-plus-square fa-3x Add AddCategory"></i>
            <input type="text class="CategoryColumn-categoryInput" placeholder="Add Category">
          </div>
          <ul class="CategoryColumn-snippetCategoryList ColumnList"></ul>
        </div>
        <div class="SnippetColumn">
          <div class="SnippetColumn-columnHeader">
            <i class="far fa-plus-square fa-3x Add AddSnippet"></i>
            <input type="text class="SnippetColumn-snippetInput" placeholder="Add Snippet">
          </div>
          <ul class="SnippetColumn-columnHeader ColumnList"></ul>
        </div>
        <div class="EditorColumn">
          <textarea class="EditorColumn-Editor"></textarea>
        </div>
      </div>
    `

    viewContainer.insertAdjacentHTML('afterbegin', activeViewHtml)

  }

  fetchAndLoadSnippetCategories() {
    this.adapter.getSnippetCategories()
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

  initAndBindEventListeners() {
    const addButtons = document.querySelectorAll('.Add')

    addButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.target.className.includes('Category')) {
          this.addSnippetCategory(e)
        } else {
          this.addSnippet()
        }
      })
    })
  }

  addSnippetCategory(e) {
    const title = e.target.nextElementSibling.value
    const owner = appState["currentUser"]["userId"]
    this.adapter.createSnippetCategory(title, owner).then(snippetCategoryData => {
      const { id, title, owner } = snippetCategoryData.data.object
      new SnippetCategory(id, title, owner)
    })
    .then(() => title = "")
    .catch(error => error.message)
  }
}

// marco@gmail.com
