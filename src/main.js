import "./common/styles/index.less"

const container = document.querySelector(".swiper-container")
const swiperWrapper = document.querySelector(".swiper-wrapper")
const swiperBullet = document.querySelectorAll(".swiper-pagination-bullet")
const swiperPagination = document.querySelector(".swiper-pagination")
const swiperPrev = document.querySelector(".swiper-button-prev")
const swiperNext = document.querySelector(".swiper-button-next")
let isAnimation = false
let index = 1
let time = null

function showBtn() {
  for (let i = 0; i < swiperBullet.length; i++) {
    swiperBullet[i].classList.remove("active")
  }
  swiperBullet[index - 1].classList.add("active")
}

function play() {
  time = setInterval(direction, 2000)
}
function stop() {
  clearInterval(time)
}

function animation(offset) {
  isAnimation = true
  const newLeft = swiperWrapper.offsetLeft + offset
  const timer = 300
  const intiver = 10
  const speed = offset / (timer / intiver)

  function go() {
    if ((speed < 0 && Number(swiperWrapper.offsetLeft) > newLeft) || (speed > 0 && Number(swiperWrapper.offsetLeft) < newLeft)) {
      swiperWrapper.style.left = Number(swiperWrapper.offsetLeft) + speed + "px"
      requestAnimationFrame(go)
    } else {
      isAnimation = false
      if (newLeft < -2400) {
        swiperWrapper.style.left = "0px"
      } else if (newLeft > -600) {
        swiperWrapper.style.left = "-3000px"
      } else {
        swiperWrapper.style.left = newLeft + "px"
      }
    }
  }

  go()
}

swiperPrev.addEventListener("click", () => {
  direction("prve")
})

swiperNext.addEventListener("click", () => {
  direction()
})
function direction(type = "next") {
  if (!isAnimation) {
    console.log(type)
    if (type === "next") {
      index === 5 ? index = 1 : index++
    } else {
      index === 1 ? index = 5 : index--
    }
    showBtn()
    animation(type === "next" ? -600 : 600)
  }
}

swiperPagination.addEventListener("click", (e) => {
  const num = Number(e.target.innerText)
  if (index !== num) {
    animation(-600 * (num - index))
    index = num
    showBtn()
  }
})

play()
container.onmouseenter = stop
container.onmouseleave = play
