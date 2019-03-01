import "./common/styles/index.less"

const container = document.querySelector(".swiper-container")
const containerWidth = container.clientWidth
const swiperWrapper = document.querySelector(".swiper-wrapper")
const swiperSlideItem = document.querySelectorAll(".swiper-slide")
const swiperBullet = document.querySelectorAll(".swiper-pagination-bullet")
const swiperPagination = document.querySelector(".swiper-pagination")
const swiperPrev = document.querySelector(".swiper-button-prev")
const swiperNext = document.querySelector(".swiper-button-next")

const len = swiperSlideItem.length - 2
const itemDom = Array.prototype.slice.apply(swiperSlideItem)
itemDom.forEach(item => {
  item.style.width = containerWidth + "px"
})
swiperWrapper.style.left = -containerWidth + "px"
swiperWrapper.style.width = containerWidth * (len + 2) + "px"
const itemWidth = swiperSlideItem[0].clientWidth
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
      if (newLeft < -len * itemWidth) {
        swiperWrapper.style.left = `-${itemWidth}px`
      } else if (newLeft > -itemWidth) {
        swiperWrapper.style.left = `-${len * itemWidth}px`
      } else {
        swiperWrapper.style.left = newLeft + "px"
      }
      isAnimation = false
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
    if (type === "next") {
      index === len ? index = 1 : index++
    } else {
      index === 1 ? index = len : index--
    }
    showBtn()
    animation(type === "next" ? itemWidth * -1 : itemWidth)
  }
}

swiperPagination.addEventListener("click", (e) => {
  const num = Number(e.target.innerText)
  if (!isAnimation && Number(num) && index !== num) {
    if (index === 1 || index === len) {
      if (Math.abs(num - index) === len - 1) {
        animation(-itemWidth * (len - num - index) * ((num - index) > 0 ? 1 : -1))
      } else {
        animation(-itemWidth * (num - index))
      }
    } else {
      animation(-itemWidth * (num - index))
    }
    index = num
    showBtn()
  }
})

play()
// container.onmouseenter = stop
// container.onmouseleave = play

let startX, endX, startLeft
container.addEventListener("touchstart", (e) => {
  if (!isAnimation) {
    stop()
    const touch = e.targetTouches[0]
    startX = touch.pageX
    startLeft = swiperWrapper.offsetLeft
  }
})

container.addEventListener("touchmove", (e) => {
  if (startX && !isAnimation) {
    const touch = e.targetTouches[0]
    endX = touch.pageX
    swiperWrapper.style.left = startLeft + endX - startX + "px"
  }
})

container.addEventListener("touchend", (e) => {
  if (!isAnimation && (endX - startX)) {
    const move = swiperWrapper.offsetLeft - startLeft
    if (Math.abs(move) > (itemWidth / 3)) {
      const width = (itemWidth) - Math.abs((endX - startX))
      animation((endX - startX) > 0 ? width : width * -1)
      if (endX - startX > 0) {
        index === 1 ? index = len : index--
      } else {
        index === len ? index = 1 : index++
      }
      showBtn()
    } else {
      animation(-(endX - startX))
    }
    startX = endX = startLeft = null
    play()
  }
})
