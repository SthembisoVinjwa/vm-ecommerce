// Login/Logout
let loginButton = document.getElementById('login-logout')

let access_token = document.cookie.split('=')[1]

if (access_token && access_token.length > 0) {
  loginButton.innerText = 'Logout'
} else {
  loginButton.innerText = 'Login'
}

loginButton.addEventListener('mouseover', function () {
  loginButton.style.cursor = 'pointer'
})

loginButton.addEventListener('click', function () {
  if (loginButton.innerText === 'Login') {
    window.location.assign('/app/user/signin')
  } else {
    document.cookie = 'access_token=' + '; path=/'
    loginButton.innerText = 'Login'
    alert('Logged out')
  }
})

// Hamburger
let hamburger = document.getElementById('hamburger-icon')

if (hamburger) {
  hamburger.addEventListener('mouseover', function () {
    hamburger.style.cursor = 'pointer'
  })
}

hamburger.addEventListener('click', function () {
  let container = document.getElementById('dropdown-container')

  if (!container.style.display || container.style.display === 'none') {
    container.style.display = 'block'
  } else {
    container.style.display = 'none'
  }
})

let hamburgerMedia = window.matchMedia('(min-width: 968px)')

hamburgerMedia.addEventListener('change', function () {
  let container = document.getElementById('dropdown-container')
  container.style.display = 'none'
})

// Cart total
function updateCart () {
  let countCircle = document.getElementById('count-circle')

  fetch(server_url + 'cart/total', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: 'Bearer ' + access_token
    }
  })
    .then(response =>
      response.json().then(data => {
        countCircle.innerText = data.cartTotal ? data.cartTotal : 0
      })
    )
    .catch(err => {
      alert(err)
    })
}

updateCart()
