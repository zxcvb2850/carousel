class Swiper {
    constructor(el, options) {
        this.el = typeof el === "string" ? el : document.querySelector(el)
    }

    initMixin(this)

    _handleOptions(options) {
        console.log(options)
    }
}

function initMixin(that) {
    that._init = function (options) {
        that._handleOptions(options)
    }
}