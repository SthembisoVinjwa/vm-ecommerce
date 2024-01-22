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
        countCircle.innerText = data.cartTotal
      })
    )
    .catch(err => {
      alert(err)
    })
}

function addToCart (clickedButton) {
  const id =
    clickedButton.parentNode.previousElementSibling.querySelector(
      '.item-id'
    ).innerText

  let access_token = document.cookie.split('=')[1]

  fetch(server_url + 'cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: 'Bearer ' + access_token
    },
    body: JSON.stringify({
      itemId: id
    })
  })
    .then(response => {
      if (response.status === 200 || response.status === 201) {
        updateCart()
      } else {
        alert('Item was not added to cart')
      }
    })
    .catch(err => {
      alert(err)
    })
}
