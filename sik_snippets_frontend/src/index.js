const app = new App()
const appState = app.state
const baseUrl = app.baseUrl
// allow user to sign up
const domElements = {
  authButtons: document.querySelectorAll('.ModalTrigger'),
  page: document.querySelector('.Page'),
  modalClose: document.querySelector('.FormModal-close'),
  formModal: document.querySelector('.FormModal'),
  // lightSwitch: document.querySelector('.LightSwitch'),
  blackout: document.querySelector('.Blackout'),
  nameField: document.querySelector('input[name="firstName"]'),
  nameRow: document.querySelector('.Form-name'),
  emailField: document.querySelector('input[name="email"]'),
  emailRow: document.querySelector('.Form-email'),
  passwordField: document.querySelector('input[name="password"]'),
  passwordRow: document.querySelector('.Form-password'),
  passwordConfirmationField: document.querySelector('input[name="passwordConfirmation"]'),
  passwordConfirmationRow: document.querySelector('.Form-confirmation'),
  formSubmit: document.querySelector('.Form-submitButton'),
  accountButton: document.querySelector('.AccountButton')
}

const togglePageLightMode = () => {
  domElements.page.classList.toggle('Light')
  console.log(appState)

}

const updateAppState = (...stateItems) => {
  for (const item of stateItems) {
    appState[item] = !appState[item]
  }
  console.log(appState)
}

const displayFormModal = () => {
  if (appState["isLoginSelected"]) {
    const { nameRow, passwordConfirmationRow } = domElements

    passwordConfirmationRow.parentNode.removeChild(passwordConfirmationRow)
    nameRow.parentNode.removeChild(nameRow)
  }
  domElements.formModal.classList.add('Visible')
  domElements.formModal.classList.add('Login')
  domElements.blackout.style.display = 'block'
  updateAppState("isFormVisible")
}

const hideFormModal = () => {
  domElements.formModal.classList.remove('Visible')
  domElements.blackout.style.display = 'none'

  if (appState["isLoginSelected"]) {
    updateAppState("isLoginSelected", "isFormVisible")
    restoreForm()
  } else {
    updateAppState("isSignupSelected", "isFormVisible")
  }
}

const restoreForm = () => {
  const {
    nameRow,
    emailRow,
    passwordRow,
    passwordConfirmationRow
  } = domElements

  emailRow.insertAdjacentElement('beforebegin', nameRow)
  passwordRow.insertAdjacentElement('afterend', passwordConfirmationRow)
}

const buildFormData = (flag) => {
  const {
    nameField,
    emailField,
    passwordField,
    passwordConfirmationField
  } = domElements

  const formData = {
    first_name: nameField.value,
    email: emailField.value,
    password: passwordField.value,
    password_confirmation: passwordConfirmationField.value
  }

  if (flag === "sessions") delete formData.password_confirmation

  return formData
}

const buildConfigObject = (formData) => {
  const configObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(formData)
  }

  return configObject
}

const enableUserAccess = (flag, obj) => {
  fetch(`${baseUrl}${flag}`, obj, { credentials: 'include' })
    .then(response => response.json())
    .then(json => handleSession(json.data))
    .catch(error => console.log(error.message))
}

const handleSession = (data) => {
  if (data.status === "created") {
    createUser(data)
    //setCurrentUserId()
    // renderUserProfile()
  } else if (data["logged_out"]) {
    // destroyUser()
    //resetCurrentUserId()
    // resetPage()
  }

  updateAppState("isUserLoggedIn")
}

const createUser = (data) => {
  console.log(data)
  // const newUser = new User()
}

const logUserOut = () => {
  const configObject = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  }

  fetch(`${baseUrl}logout`, configObject, { credentials: 'include' })
    .then(response => response.json())
    .then(json => handleSession(json))
    .catch(error => console.log(error.message))
}

// domElements.lightSwitch.addEventListener('click', () => {
//   togglePageLightMode()
// })

domElements.authButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.className.includes("login")) {
      updateAppState("isLoginSelected")
    } else {
      updateAppState("isSignupSelected")
    }
    displayFormModal()
  })
})

domElements.modalClose.addEventListener('click', () => {
  hideFormModal()
})

domElements.formSubmit.addEventListener('click', (e) => {
  e.preventDefault()

  let flag = appState["isLoginSelected"] ? "sessions" : "users"
  const formData = buildFormData(flag)
  const configObject = buildConfigObject(formData)

  enableUserAccess(flag, configObject)
  hideFormModal()
})

domElements.accountButton.addEventListener('click', () => {
  logUserOut()
})

// change ui on login
// expose category column on book click / close all
// fetch all snippet categories of user
// list all snippet categories and associated snippets
// render snippet content on snippet click
// save snippet
// logout
