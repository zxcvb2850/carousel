import Swiper from "./components/Swiper"
import "./main.less"

const swiper = new Swiper(".swiper-container", {
  loop: true,
  autoPlay: true,
  speed: 3000,
  click: true,
  isArrow: true,
  css: true,
  isPaginat: true,
  swiperWrapClass: "swiper-wrapper"
})

console.log(swiper)
