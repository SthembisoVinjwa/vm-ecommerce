// Login/Logout
let loginButton = document.getElementById("login-logout")

let access_token = document.cookie.split('=')[1]

if (access_token.length > 0) {
    loginButton.innerText = "Logout"
} else {
    loginButton.innerText = "Login"
}

loginButton.addEventListener('mouseover', function() {
    loginButton.style.cursor = "pointer"
})

loginButton.addEventListener('click', function() {
    if (loginButton.innerText === 'Login') {
        window.location.assign("/app/user/signin")
    } else {
        document.cookie = 'access_token=' + '; path=/'
        loginButton.innerText = "Login"
        alert('Logged out')
    }   
})