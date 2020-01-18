const app = new App()
const appState = app.state
const baseUrl = app.baseUrl
// allow user to sign up
const domElements = {
  authButtons: document.querySelectorAll('.ModalTrigger'),
  page: document.querySelector('.Page'),
  modalClose: document.querySelector('.FormModal-close'),
  formModal: document.querySelector('.FormModal'),
  signUpButton: document.querySelector('.Form-signUpButton'),
  lightSwitch: document.querySelector('.LightSwitch'),
  blackout: document.querySelector('.Blackout'),
  nameField: document.getElementsByTagName('input[name="firstName"]'),
  emailField: document.getElementsByTagName('input[name="email"]'),
  passwordField: document.getElementsByTagName('input[name="password"]'),
  passwordConfirmationField: document.getElementsByTagName('input[name="passwordConfirmation"]'),
  formSubmit: document.querySelector('.Form-submitButton')
}

const togglePageLightMode = () => {
  domElements.page.classList.toggle('Light')
}

const displayFormModal = () => {
  domElements.formModal.classList.add('Visible')
  domElements.blackout.style.display = 'block'
  updateAppState("isFormVisible")
}

const hideFormModal = () => {
  domElements.formModal.classList.remove('Visible')
  domElements.blackout.style.display = 'none'

  if (appState["isLoginSelected"] == true) {
    updateAppState(["isLoginSelected", "isFormVisible"])
  } else {
    updateAppState(["isSignupSelected", "isFormVisible"])
  }
}

const updateAppState = (...stateItems) => {
  for (const item of stateItems) {
    appState[item] = !appState[item]
  }
  console.log(appState)
}

const buildFormData = () => {
  const formData = {
    firstName: domElements.nameField.value,
    email: domElements.emailField.value,
    password: domElements.passwordField.value,
    passwordConfirmation: domElements.passwordConfirmationField.value
  }

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

const enableUser = (flag, obj) => {
  fetch(`${baseUrl}${flag}`, obj)
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.log(error.message))
}

domElements.lightSwitch.addEventListener('click', () => {
  togglePageLightMode()
})

domElements.authButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    displayFormModal()
    if (btn.className.includes("login")) {
      updateAppState("isLoginSelected")
    } else {
      updateAppState("isSignupSelected")
    }
  })
})

domElements.modalClose.addEventListener('click', () => {
  hideFormModal()
})

domElements.formSubmit.addEventListener('click', () => {
  const formData = buildFormData()
  const configObject = buildConfigObject(formData)
  let flag

  appState["isLoginSelected"] == true ? flag = "sessions" : flag = "users"

  enableUser(flag, configObject)
  hideFormModal()
})

