let mobileMenu = document.querySelector(".mobile-menu")
let mobileMenuLinks = document.querySelectorAll(".mobile-menu li a")

function openMobileMenu () {
    mobileMenu.classList.add("active")
}

function closeMobileMenu () {
    mobileMenu.classList.remove("active")
}

mobileMenuLinks.forEach(function(link) {
    link.addEventListener("click", closeMobileMenu)
})


let spectaSection = document.getElementById("sec3")
let body = document.querySelector("body")

function goToSpecta() {
    let spectaY = spectaSection.getBoundingClientRect().y
    window.scrollTo(0, spectaY, { duration: 10000 })
}

let counterElem = document.querySelectorAll(".counter :nth-child(2)")
let minus = document.querySelector(".plusminus:nth-child(1)")
let plus = document.querySelector(".plusminus:nth-child(3)")
let counter = 1 

function increaseCounter() {if (counter == 9) {plus.style.opacity = 0.5; return};
    counter ++; counterElem.forEach(function(elem){elem.innerHTML = counter;});
    minus.style.opacity = 1;}
function decreaseCounter() {if (counter == 0) {minus.style.opacity = 0.5;; return}
    counter --; counterElem.forEach(function(elem){elem.innerHTML = counter;}); counterElem.innerHTML = counter;
    plus.style.opacity = 1;}