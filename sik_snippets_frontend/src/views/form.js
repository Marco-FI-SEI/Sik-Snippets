import { dom } from './dom'

dom.authButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    dom.formModal.classList.add('Visible')
    dom.page.classList.add('Blackout')

    dom.modalClose.addEventListener('click', () => {
      dom.formModal.classList.remove('Visible')
      dom.page.classList.remove('Blackout')
    })

    dom.page.addEventListener('click', () => {
      dom.formModal.classList.remove('Visible')
      dom.page.classList.remove('Blackout')
    })
  })
})

export const renderForm = () => {
  const markup = `
    <form method="POST" class="ContactForm">
      <div class="ContactForm_row">
        <label for="firstName">First Name</label>
        <input type="text" name="firstName">
      </div>
      <div class="ContactForm_row">
        <label for="email">Email</label>
        <input type="email" name="email">
      </div>
      <div class="ContactForm_row">
        <label for="password">Password</label>
        <input type="password" name="password">
      </div>
      <div class="ContactForm_row">
        <label for="password_confirmation">Repeat Password</label>
        <input type="password_confirmation" name="password_confirmation">
      </div>
      <div class="ContactForm_row">
        <button class="SubmitButton Button">Submit</button>
      </div>
    </form>
  `

}
