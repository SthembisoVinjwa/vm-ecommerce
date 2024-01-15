// box-category on hover
let overlay = document.getElementsByClassName("overlay")
let menButton = document.getElementById("men-button")
let womenButton = document.getElementById("women-button")
let seasonButton = document.getElementById("season-button")
let sportsButton = document.getElementById("sports-button")

menButton.addEventListener('mouseover', function() {
    menButton.style.cursor = "pointer"
})

womenButton.addEventListener('mouseover', function() {
    womenButton.style.cursor = "pointer"
})

seasonButton.addEventListener('mouseover', function() {
    seasonButton.style.cursor = "pointer"
})

sportsButton.addEventListener('mouseover', function() {
    sportsButton.style.cursor = "pointer"
})

for (let i = 0; i < overlay.length; i++) {
    overlay[i].addEventListener('mouseover', function() {
        overlay[i].style.opacity = "0.3"
        overlay[i].style.cursor = "pointer"
    })
    overlay[i].addEventListener('mouseout', function() {
        overlay[i].style.opacity = "0.85"
    })
}