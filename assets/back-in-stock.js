class BackInStockComponent extends HTMLElement {
    constructor() {
      super();
  
      // Add event listener for the "back in stock" event on the parent form div
      this.productForm =  document.querySelector(`product-form[data-section="${this.dataset.section}"]`);
      this.form = this.querySelector('form');
      this.drawerTrigger = this.querySelector('summary');  
      this.drawerContent = this.querySelector('[data-content]');
      this.loader = this.querySelector('[data-loader]');
      this.successText = this.querySelector('[data-success-text]');
      this.defaultText = this.querySelector('[data-default-text]');
      this.initEvents(); 
      this.getVariantData(); 
      this.updateVariantId(); 
    }

    initEvents() {
        this.productForm.addEventListener('alert-not-in-stock', this.handleBackInStock.bind(this)); 
        this.productForm.addEventListener('alert-in-stock', this.handleBackInStock.bind(this)); 

        this.form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
            this.subscribeUser(); // Call the subscribe function
        });

        this.drawerTrigger.addEventListener('click', (event)=> {
            this.toggleDrawer(event); 
        }); 

        this.drawerContent.style.height = 0; 
    }


    updateVariantId() {
        let currentVariant = this.getVariantData().find((variant) => {
            if(variant.options && variant.options.length > 1) {
                return !variant.options.map((option, index) => {
                    return this.options[index] === option;
                }).includes(false);
            } else {
                return variant
            }

        });

        this.dataset.variantId = currentVariant.id;
    }


    getVariantData() {
        this.variantData = this.variantData === JSON.parse(document.querySelector('#product-json').textContent) ? this.variantData :  JSON.parse(document.querySelector('#product-json').textContent);
        return this.variantData.variants;
    }


    subscribeUser() {
        this.defaultText.style.opacity = 0; 
        this.loader.style.display = 'block'; 
        const emailInput = this.form.querySelector('[type="email"]').value;
        const variantId = this.dataset.variantId; 
        const payload = {
            "data": {
                "type": "back-in-stock-subscription",
                "attributes": {
                    "profile": {
                        "data": {
                            "type": "profile",
                            "attributes": {
                                "email": emailInput,
                                "external_id": null
                            }
                        }
                    },
                    "channels": ["EMAIL"]
                },
                "relationships": {
                    "variant": {
                        "data": {
                            "type": "catalog-variant",
                            "id": "$shopify:::$default:::" + variantId
                        }
                    }
                }
            }
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                revision: '2023-09-15',
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        };

        function showSuccess(pContainer) {
            pContainer.loader.style.display = 'none'; 
            pContainer.successText.style.display = 'block'; 
        };

        fetch("https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=TeNSXA", requestOptions)
            .then(response => response)
            .then(result => { console.log(result); showSuccess(this);} )
            .catch(error => console.log('error', error));
    }

    handleBackInStock(event) {
        let variantId = event.detail.id; 
        
        // Handle the "back in stock" event here
        if(event.type == "alert-in-stock") {
            this.classList.add('is-hidden'); 
            this.classList.remove('is-visible'); 
            this.dataset.variantId = variantId; 
        } else {
            this.classList.remove('is-hidden'); 
            this.classList.add('is-visible'); 
            this.dataset.variantId = variantId; 
        }
    }

    toggleDrawer(event) {
        event.preventDefault();
        const currentTarget = event.currentTarget;
        this.openDrawer(currentTarget);
      }

    closeDrawer(pDrawerTrigger) {
        const content = pDrawerTrigger.closest('details').querySelector('[data-content]');
        content.style.height = 0;

        pDrawerTrigger.setAttribute('aria-expanded', false);
    
        setTimeout(() => {
            pDrawerTrigger.closest('details').removeAttribute('open');
        }, 450);
      }
    
    
      openDrawer(pDrawerTrigger) {
         pDrawerTrigger.setAttribute('aria-expanded', true);
      
         if (pDrawerTrigger.closest('details').getAttribute('open')) {
           this.closeDrawer(pDrawerTrigger);
           return;
         }
    
        pDrawerTrigger.closest('details').setAttribute('open', true);
        const content = pDrawerTrigger.closest('details').querySelector('[data-content]');
        content.style.height = content.querySelector('form').offsetHeight + 'px';
      }

  }
  
  // Define the custom element name and register it
  customElements.define('back-in-stock', BackInStockComponent);