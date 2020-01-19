class App {
  constructor() {
    this.state = this.setState()
    this.baseUrl = "http://localhost:3000/api/v1/"
  }

  setState = () => {
    const state = {
      isFormVisible: false,
      isUserLoggedIn: false,
      isLoginSelected: false,
      isSignUpSelected: false,
      currentUserId: ""
    }

    return state
  }
}
