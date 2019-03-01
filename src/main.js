import Swiper from "./Swiper"
import "./common/styles/index.less"

const swiper = new Swiper(".swiper-container", {
  // loop: false,
  click: true,
  isArrow: true,
  css: false,
  isPaginat: true,
  swiperWrapClass: "swiper-wrapper"
})

console.log(swiper)
