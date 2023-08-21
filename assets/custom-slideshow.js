
class ImageSlideshow extends HTMLElement {
  constructor() {
    super();

    // Extract attributes and convert them into an object
    const { autoplay, slidesPerView,  a11y, freeMode, pagination, navigation, loop, disableOn, spaceBetween, centeredSlides, breakpoints, numberPagination, effect, controlContainer} = this.attributes;


    
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
        speed: 200,
        effect: effect ? effect.value : 'slide',
        navigation: false,
        spaceBetween: spaceBetween ? parseInt(spaceBetween.value) : 20,
        touchReleaseOnEdges: true,
        slidesPerView: slidesPerView ? slidesPerView.value : 1,
        centeredSlides: centeredSlides && centeredSlides.value === "true",
        breakpoints: breakpoints ? convertToObject(breakpoints.value) : false,
        centeredSlidesBounds: centeredSlides && centeredSlides.value === "true",
        controlContainer: controlContainer ? controlContainer.value : false
    }



    if(numberPagination) {
      this.options.pagination = {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + "0" + (index + 1) + "</span>";
        }
      }
    }

   
    function convertToObject(pStringObject) {
      const inputString = pStringObject;
      const jsonString = inputString.replace(/'/g, '"'); // Replace single quotes with double quotes
      const result = JSON.parse(jsonString);
      console.log(result); 
      return result; 
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

    console.log('html setup'); 
    
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
    if (this.swiper) {
      return Promise.resolve(this.swiper); // Already initialized, resolve with the existing instance
    }
  
    return new Promise((resolve, reject) => {
      import('./swiper.module.js').then((Swiper) => {
        if (this.attributes.preventLoad && this.attributes.preventLoad.value === 'true') {
          console.log('loading prevented'); 
          reject(new Error('Loading is prevented'));
          return;
        }
  
        if (this.options.controlContainer) {
          console.log('has control container'); 
          const controlElement = document.querySelector(this.options.controlContainer);
          controlElement.setAttribute('preventLoad', 'false');
          controlElement.initSwiper().then(()=> {

              this.options.controller = {
                by: 'slide',
                control: controlElement.getSwiper(),
              };

              this.setUpHtml(this.options);
              this.swiper = new Swiper.default(this.querySelector('.swiper-container'), this.options);
      
          });

        }else {
         this.setUpHtml(this.options);
          this.swiper = new Swiper.default(this.querySelector('.swiper-container'), this.options);
        }
          
        resolve(this.swiper); // Resolve the promise with the initialized swiper instance
      }).catch(error => {
        reject(error); // Reject the promise if there was an error during import
      });
    });
  }
  
  getSwiper() {
    return this.swiper; 
  }
}

customElements.define('custom-slideshow', ImageSlideshow);