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
  let rememberMe = document.getElementById("remember").checked

  signIn(email, password, rememberMe)
}

function signIn (email, password, rememberMe) {
  let status = 404

  fetch(server_url + 'users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
      remember: rememberMe
    })
  })
    .then(response => {
      status = response.status
      response.json().then(data => {
        if (status === 200) {
          setCookie('access_token', data.token, rememberMe ? 30 : 1)
          window.location.assign('/app')
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
        // Remember me to false
        signIn(email, password, false) 
      })
      .catch(err => {
        alert(err)
      })
  } else {
    alert('Password do not match')
  }
}

function forgotPassword () {
  window.location.assign('/app/user/forgot/email')
}

function sendEmail () {
  let user_email = document.getElementById('email-forgot').value

  fetch(server_url + 'users/forgot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: user_email
    })
  })
    .then(alert('Email sent to ' + user_email))
    .catch(err => {
      alert(err)
    })
}

function resetPassword () {
  let password = document.getElementById('password-signup').value
  let confirm = document.getElementById('confirm-signup').value

  if (password === confirm) {
    fetch(server_url + 'users/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user_email,
        password: password
      })
    })
      .then(response => {
        if (response.status === 200) {
          alert('Password reset successful')
          window.location.assign('/app/user/signin')
        } else {
          alert('Password reset unsuccessful. Please restart resest process.')
        }
      })
      .catch(err => {
        alert(err)
      })
  } else {
    alert('Passwords do not match')
  }
}

function updateUser () {
  let newName = document.getElementById('name-signup').value
  let newEmail = document.getElementById('email-update').value
  let oldPass = document.getElementById('password-update').value
  let newPass = document.getElementById('confirm-signup').value
  let confirmPass = document.getElementById('confirm-update').value

  let access_token = document.cookie.split('=')[1]

  if (oldPass.length > 0 && newPass.length > 0 && confirmPass.length > 0) {
    if (oldPass === newPass) {
      return alert('Old Password cannot be used as a new Password')
    }

    if (newPass !== confirmPass) {
      return alert('Passwords do not match')
    }

    fetch(server_url + 'users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: newEmail,
        password: oldPass
      })
    }).then(response => {
      if (response.status === 200) {
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
              propName: 'password',
              propValue: newPass
            }
          ])
        })
          .then(alert('Password updated successfully'))
          .catch(err => {
            alert(err)
          })
      }
    })
  } else {
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
          }
        ])
      })
        .then(alert('Name updated successfully'))
        .catch(err => {
          alert(err)
        })
    } else {
      alert('Nothing to update')
    }
  }
}

function deleteUser () {
  if (window.confirm('Are you sure you want to delete your account?')) {
    let access_token = document.cookie.split('=')[1]

    fetch(server_url + 'users/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: 'Bearer ' + access_token
      }
    })
    .then(response => {
      if (response.status === 200) {
        alert('User deleted successfully')
        window.location.assign('/app/user/signin')
      } else {
        alert('Could not delete user')
      }
    })
    .catch(err => {
      alert(err)
    })
  }
}

function newPassword () {
  let oldPass = document.getElementById('password-update')
  let newPass = document.getElementById('confirm-signup')
  let confirmPass = document.getElementById('confirm-update')

  let updateBtn = document.getElementById('update-btn')

  if (oldPass.style.display === 'none') {
    oldPass.style.display = 'flex'
    newPass.style.display = 'flex'
    confirmPass.style.display = 'flex'
    updateBtn.value = 'Keep Password'
  } else {
    oldPass.style.display = 'none'
    newPass.style.display = 'none'
    confirmPass.style.display = 'none'
    updateBtn.value = 'Change Password'
  }
}

function setCookie (cName, cValue, expDays) {
  let date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'
}
