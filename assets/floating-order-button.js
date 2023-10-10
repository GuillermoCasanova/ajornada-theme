class FloatingOrderButton extends HTMLElement {
    constructor() {
        super();
        this.initEvents(); 
        this.button = this.querySelector('[data-order-link]')
        this.showFlower(); 
    }

    initEvents() {
        let showOrderStateTrigger = document.querySelectorAll('.shopify-section')[2]; 
        let hideOrderStateTrigger = document.querySelectorAll('.shopify-section')[0]; 
        let showFlowerTrigger = document.querySelectorAll('.shopify-section')[0]; 
        //Hides the "order" text state
        this.observeTrigger(hideOrderStateTrigger, this.hideOrderState.bind(this),  {root: null, rootMargin: '100px', threshold: 1});
        //Shows the "order" text state
        this.observeTrigger(showOrderStateTrigger, this.showOrderState.bind(this),  {root: null, rootMargin: '100px', threshold: .8});
    }
    
    showFlower() {
        setTimeout(()=> {
            this.classList.add('is-visible'); 
        }, 200); 
    }

    hideOrderState() {
        this.button.classList.remove('is-order-state'); 
    }

    showOrderState() {
        this.button.classList.add('is-order-state'); 
    }

    observeTrigger(element, callback, revertCallBack, options) {
        const target = element;
  
        if (!target) {
          console.error(`Element with name "${elementId}" not found.`);
          return;
        }
  
        const defaultOptions = {
          root: null, // Use the viewport as the root
          rootMargin: '100px', // No margin
          threshold: .7, // 100% of the element must be visible
        };
  
        const observerOptions = { ...defaultOptions, ...options };
  
        const intersectionCallback = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback(entry.target);
            } 
          });
        };
  
        const observer = new IntersectionObserver(intersectionCallback, observerOptions);
  
        observer.observe(target);
      }


}

// Define the custom element
customElements.define("floating-order-button", FloatingOrderButton);
