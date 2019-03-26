import Swiper from "./components/Swiper"
import "./main.less"

const swiper = new Swiper(".swiper-container", {
  loop: false,
  autoPlay: true,
  speed: 1000,
  click: true,
  isArrow: true,
  css: true,
  isPaginat: true,
  swiperWrapClass: "swiper-wrapper"
})

console.log(swiper)
