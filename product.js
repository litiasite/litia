// PRODUCT GALLERY

let mobileX = window.matchMedia("(max-width: 768px)")
let galleryImg = Array.from(document.querySelector(".gallery").children)
let imageW = document.querySelector(".gallery .span-2").getBoundingClientRect().width
let gallery = document.querySelector(".gallery")
let galleryIndex = 0

if (mobileX.matches) {
    scrollGallery()
}

function scrollGallery() {
    setInterval(function(){
        galleryIndex ++
        if (galleryIndex == galleryImg.length) {gallery.scrollTo({top: 0, left: 0, behavior: "auto"})}
        else{gallery.scrollTo({top: 0, left: imageW * galleryIndex, behavior: "smooth"})}
    }, 5000)
}

function draw() {
    for(let i = 0; i <galleryImg.length; i++) {
        let imgX = galleryImg[i].getBoundingClientRect().x
        if ( imgX > 0 && imgX < gallery.getBoundingClientRect().width ){
            galleryIndex = i
        }
    }
}