function showSignUp () {
  let signin = document.getElementById('signin')
  let signup = document.getElementById('signup')

  var title = document.querySelector('.container h2')
  title.innerHTML = 'Sign Up'

  signin.style.display = 'none'
  signup.style.display = 'flex'
}

function showSignIn () {
  let signin = document.getElementById('signin')
  let signup = document.getElementById('signup')

  var title = document.querySelector('.container h2')
  title.innerHTML = 'Sign In'

  signin.style.display = 'flex'
  signup.style.display = 'none'
}

function getCredentials () {
  let email = document.getElementById('email').value
  let password = document.getElementById('password').value

  signIn(email, password)
}

function signIn (email, password) {
  let status = 404

  fetch(server_url + 'users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(response => {
      status = response.status
      response.json().then(data => {
        if (status === 200) {
          setCookie('access_token', data.token, 30)
          window.location.assign('/')
        } else {
          alert(data.message)
        }
      })
    })
    .catch(err => {
      alert(err)
    })
}

function signUp () {
  let name = document.getElementById('name-signup').value
  let email = document.getElementById('email-signup').value
  let password = document.getElementById('password-signup').value
  let confirm = document.getElementById('confirm-signup').value

  if (password === confirm) {
    fetch(server_url + 'users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })
      .then(response => {
        signIn(email, password)
      })
      .catch(err => {
        alert(err)
      })
  } else {
    alert('Password do not match')
  }
}

function updateUser () {
  let newName = document.getElementById('name-signup').value
  let newEmail = document.getElementById('email-update').value

  let access_token = document.cookie.split('=')[1]

  if (currentName !== newName || currentEmail !== newEmail) {
    fetch(server_url + 'users/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: 'Bearer ' + access_token
      },
      body: JSON.stringify([
        {
          propName: 'name',
          propValue: newName
        },
        {
          propName: 'email',
          propValue: newEmail
        }
      ])
    })
      .then(response => {
        alert('Updated successfully')
      })
      .catch(err => {
        alert(err)
      })
  } else {
    alert('Nothing to update')
  }
}

function newPassword() {
  let oldPass = document.getElementById("password-update")
  let newPass = document.getElementById("confirm-signup")
  let confirmPass = document.getElementById("confirm-update")

  oldPass.style.display = "flex"
  newPass.style.display = "flex"
  confirmPass.style.display = "flex"
}

function setCookie (cName, cValue, expDays) {
  let date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'
}
