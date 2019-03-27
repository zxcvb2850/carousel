import Swiper from "./components/Swiper"
import "./main.less"

const swiper = new Swiper(".swiper-container", {
  loop: false,
  autoPlay: false,
  speed: 2000,
  click: true,
  clickCallback: function (e, index) {
    console.log("当前点击的是：", index, e)
  },
  isArrow: true,
  css: false,
  isPaginat: true,
  swiperWrapClass: "swiper-wrapper",
  changeCurrIndex: function (index) {
    console.log("轮播图滚动当前下标：", index)
  }
})

setTimeout(() => {
  console.log(swiper.next())
}, 2000)
