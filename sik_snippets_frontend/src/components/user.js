class User {
  constructor(userId, firstName, email, isLoggedIn = true) {
    this.userId = userId,
    this.firstName = firstName,
    this.email = email
    this.isLoggedIn = isLoggedIn
    this.adapter = new UserAdapter()
    this.renderUserProfile
  }

  renderUserProfile() {
    const viewContainer = document.querySelector('.Container')
    const landingView = document.querySelector('.Info')
    landingView.classList.add('Hide')
    const activeViewHtml = getActiveView()
    viewContainer.appendChild(activeViewHtml)
  }

  getActiveView() {
    return `
      <div class="Profile">
        <div class="Sidebar">
          <i class="fas fa-book-medical fa-3x Sidebar-book"></i>
          <div class="AccountButton"><i class="fas fa-sign-out-alt fa-3x"></i></div>
        </div>
        <div class="CategoryColumn">
          <div class="CategoryColumn-columnHeader">
            <i class="far fa-plus-square fa-3x"></i>
            <div class="CategoryColumn-columnHeaderTitle">Add Category</div>
          </div>
          <ul class="CategoryColumn-snippetCategoryList"></ul>
        </div>
        <div class="SnippetColumn">
          <div class="SnippetColumn-columnHeader">
            <i class="far fa-plus-square fa-3x"></i>
            <div class="SnippetColumn-columnHeaderTitle">Add Category</div>
          </div>
        </div>
        <div class="EditorColumn">
          <textarea class="EditorColumn-Editor"></textarea>
        </div>
      </div>
    `
  }
}
