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

function signIn () {
  let email = document.getElementById('email').value
  let password = document.getElementById('password').value

  let form = new FormData()

  form.append('email', email)
  form.append('password', password)

  return true
}

function signUp () {
  let name = document.getElementById('name-signup').value
  let email = document.getElementById('email-signup').value
  let password = document.getElementById('password-signup').value
  let confirm = document.getElementById('confirm-signup').value

  let form = new FormData()

  form.append('name', name)
  form.append('email', email)
  form.append('password', password)

  if (password === confirm) {
    return true
  }

  return false
}
