
class ImageSlideshow extends HTMLElement {
    constructor() {
      super();

      // Extract attributes and convert them into an object
      const { autoplay, slidesPerView,  a11y, freeMode, pagination, navigation, loop, disableOn, spaceBetween, centeredSlides} = this.attributes;

      this.mediaQueries = {
        mediumUp: window.matchMedia('(min-width: 700px)'),
        largeUp: window.matchMedia('(min-width: 940px)')
     }

      if(disableOn) {
        this.setUpMediaQueries(disableOn.value); 
        this.checkForMediaQueries = true; 
      }

     this.options = {
          autoplay: autoplay && autoplay.value === 'true' ? {
            enabled: true,
            delay: 0 
          } : false,
 
          pagination:  pagination && pagination.value === 'true' ?  {
            el: '.swiper-pagination',
            type: 'bullets',
          } : false,
          preloadImages: true,
          freeMode: freeMode && freeMode.value === 'true' ? {
            enabled: true,
            sticky: false
          } : false, 
          resistance: false,
          loop: loop && loop.value == 'true' || false,
          speed: autoplay ? 5000 : 1000,
          navigation: false,
          spaceBetween: spaceBetween ? parseInt(spaceBetween.value) : 20,
          touchReleaseOnEdges: true,
          slidesPerView: slidesPerView ? slidesPerView.value : 1,
          centeredSlides: centeredSlides && centeredSlides.value === "true",
      }


  
      this.init();
    }

    setUpMediaQueries(pDisableOn) {
      const mediaQueryList = this.mediaQueries[pDisableOn];
      this.disableOn = pDisableOn; 

      mediaQueryList.addEventListener("change", event => {
        if (event.matches) {
          this.destroySwiper();
          this.resetOriginalHtml(); 
        } else {
          this.initSwiper();
        }
      });
    } 

    init() {
        if(this.checkForMediaQueries && this.mediaQueries[this.disableOn].matches) {
          return
        } else {
            this.initSwiper(); 
        }
    } 

    resetOriginalHtml() {
      // Remove current children
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      this.originalChildren.forEach(child => this.appendChild(child.cloneNode(true)));
    }

   

    setUpHtml(pOptions) {

      // Save the original HTML content of children elements
      this.originalChildren = Array.from(this.children).map(child => child.cloneNode(true));

      this.innerHTML = `
        <style>

          .marquee-timing  {
              -webkit-transition-timing-function:linear!important;
              -o-transition-timing-function:linear!important;
              transition-timing-function:linear!important;
          }
      
          .swiper-container {
            width: 100%;
            position: relative; 
          }
          .swiper-slide {
          }

          .swiper-content {
            }
        </style>
        <div class="swiper-container">
          <div class="swiper-wrapper ${pOptions.autoplay ? 'marquee-timing': ''}">
            ${Array.from(this.children)
              .map(child => `<div class="swiper-slide">${child.outerHTML}</div>`)
              .join('')}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      `;

    }

    destroySwiper() {
      if (this.swiper) {
        this.innerHTML =  this.originalChildren; 
        this.swiper.detachEvents(); 
        this.swiper.destroy(true, true); 
        this.swiper = null; 
        this.swiper = null;
      }
    }
  
    initSwiper() {
      if (!this.swiper) {
        this.setUpHtml(this.options);
        import('./swiper.module.js').then((Swiper) => {
          //this.mediaQueries.largeUp.addEventListener("change", this.handleLargeUp.bind(this)); 
          this.swiper = new Swiper.default(this.querySelector('.swiper-container'), this.options);
        }); 
      }
    }
  }
  
  customElements.define('custom-slideshow', ImageSlideshow);