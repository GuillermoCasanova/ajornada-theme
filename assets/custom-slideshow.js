
class ImageSlideshow extends HTMLElement {
    constructor() {
      super();

      // Extract attributes and convert them into an object
      const { autoplay, slidesPerView,  a11y, freeMode, pagination, navigation, loop, disableOn} = this.attributes;

      this.mediaQueries = {
        mediumUp: window.matchMedia('(min-width: 700px)'),
        largeUp: window.matchMedia('(min-width: 940px)')
     }

      if(disableOn) {
        this.setUpMediaQueries(disableOn.value); 
        this.checkForMediaQueries = true; 
      }

     this.options = {
          autoplay: {
          enabled: autoplay && autoplay.value === 'true',
          delay: 0 
          },
          createElements: true,
          slidesPerView: parseInt(slidesPerView.value) || 1,
          navigation: navigation  && navigation.value === 'true',
          loop: loop && loop.value == 'true' || false,
          speed: autoplay ? 5000 : 1000,
          pagination: pagination  && pagination.value === 'true', 
          navigation: navigation  && pagination.value === 'true', 
          preloadImages: true,
          freeMode: {
            enabled: freeMode && freeMode.value === 'true' || false, 
            sticky: false
          }, 
          resistance: false,
          spaceBetween: 20,
          touchReleaseOnEdges: true,
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
          }
          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            height: 300px;
          }
        </style>
        <div class="swiper-container">
          <div class="swiper-wrapper ${pOptions.autoplay ? 'marquee-timing': ''}">
            ${Array.from(this.children)
              .map(child => `<div class="swiper-slide">${child.outerHTML}</div>`)
              .join('')}
          </div>
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