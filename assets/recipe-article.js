// Define the custom element
class RecipeInformationToggle extends HTMLElement {
    constructor() {
      super();
      // Find the parent element with the class ".recipe-information"
      this.recipeInfo = this.closest('.recipe-information');

      // Create a button element inside the shadow DOM
      const button = this.querySelector('button');

      // Attach a click event listener to the button
      button.addEventListener('click', () => {
        // Toggle a CSS class on the parent element
        if (this.recipeInfo) {
          this.recipeInfo.classList.toggle('is-active');
        }
      });

      this.initSwipeGestures();
    }

    showInformation() {
      this.recipeInfo.classList.add('is-active');
    }

    hideInformation() {
      this.recipeInfo.classList.remove('is-active');
    }

    initSwipeGestures() {
      this.swipeDetection = null;

      // Load HAMMER JS Plugin from the Shopify CDN
      loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/hammer.min.js?v=1698261229').then(() => {
        const swipeElement = this.closest('[data-hammer-swipe-element]');
        this.swipeDetection = new Hammer(swipeElement);

        this.swipeDetection.get('pinch').set({ enable: true });
        this.swipeDetection.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

        this.swipeDetection.on('swipe', (e) => {
          if (e.direction === Hammer.DIRECTION_DOWN) {
            this.hideInformation();
          } else if (e.direction === Hammer.DIRECTION_UP) {
            this.showInformation();
          }
        });
      });
    }
  }

  // Define the custom element's tag name
  customElements.define('recipe-information-toggle', RecipeInformationToggle);

  class RecipeScrollAnimations extends HTMLElement {
    constructor() {
      super();
      this.images = this.querySelectorAll('img');
    }

    connectedCallback() {
      this.setUpDOM().then(() => {
        this.setUpImagesAnimation();
        this.setUpPinning();
      });
    }

    async setUpDOM() {
      const wrap = (el, wrapper) => {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      };

      // Wrap the entire logic in a Promise
      return new Promise((resolve) => {
        const promises = Array.from(this.images).map((image, index) => {
          const wrapper = document.createElement('div');
          wrapper.classList.add('recipes-images__image');
          wrap(image, wrapper);

          // Simulate an asynchronous operation (you can replace this with actual async work)
          return new Promise((innerResolve) => setTimeout(innerResolve, 100));
        });

        Promise.all(promises).then(resolve);
      });
    }

    setUpImagesAnimation() {
      const container = this;

      // Load GSAP and ScrollTrigger from the Shopify CDN
      Promise.all([
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/gsap.min.js?v=1694471182'),
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/ScrollTrigger.min.js?v=1694471189'),
      ])
        .then(() => {
          gsap.registerPlugin(ScrollTrigger);
          this.querySelectorAll('img').forEach((img) => {
            gsap.fromTo(
              img,
              {
                opacity: 0,
                webkitFilter: 'blur(20px)',
              },
              {
                webkitFilter: 'blur(0px)',
                opacity: 1,
                ease: 'power1.out',
                scrollTrigger: {
                  trigger: img,
                  scrub: 1,
                  reverse: true,
                  start: 'top 300%',
                  end: 'bottom center',
                },
              }
            );
          });
        })
        .catch((error) => {
          console.log(error);
          console.error('Script loading failed! Handle this error');
        });
    }

    setUpPinning() {
      // Load GSAP and ScrollTrigger from the Shopify CDN
      Promise.all([
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/gsap.min.js?v=1694471182'),
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/ScrollTrigger.min.js?v=1694471189'),
      ])
        .then(() => {
          const mm = gsap.matchMedia();

          gsap.registerPlugin(ScrollTrigger);

          mm.add('(min-width: 700px)', () => {
            document.querySelector('[data-gsap-pin-element]').style.height = this.offsetHeight +  200 +'px';
          });
        })
        .catch(() => {
          console.error('Script loading failed! Handle this error');
        });
    }
  }

  customElements.define('recipe-scroll-animations', RecipeScrollAnimations);