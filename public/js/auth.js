/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const miFormulario = document.querySelector('form')
miFormulario.addEventListener('submit', evento => {
  evento.preventDefault()
  const formData = {}

  for (const elements of miFormulario.elements) {
    if (elements.name.length > 0) {
      formData[elements.name] = elements.value
    }
  }
  fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
      if (msg) return console.error(msg)

      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(err => console.log(err))
})

function handleCredentialResponse (response) {
  const body = { idToken: response.credential }
  fetch('http://localhost:8080/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(({ token, usuario }) => {
      console.log(token)
      localStorage.setItem('token', token)
      localStorage.setItem('email', usuario.correo)
      window.location = 'chat.html'
    })
    .catch(console.warn())
}
const button = document.getElementById('google_signout')
button.onclick = () => {
  console.log(google.accounts.id)
  google.accounts.id.disableAutoSelect()
  google.accounts.id.revoke(localStorage.getItem('email'), done => {
    localStorage.clear()
    location.reload()
  })
}
