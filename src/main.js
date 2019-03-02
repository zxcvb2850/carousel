import Swiper from "./Swiper"
import "./common/styles/index.less"

new Swiper(".swiper-container", {
  loop: false,
  autoPlay: true,
  speed: 3000,
  click: true,
  isArrow: true,
  css: false,
  isPaginat: true,
  swiperWrapClass: "swiper-wrapper"
})
