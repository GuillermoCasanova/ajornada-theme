class BackInStockComponent extends HTMLElement {
    constructor() {
      super();
  
      // Add event listener for the "back in stock" event on the parent form div
      this.productForm =  document.querySelector(`product-form[data-section="${this.dataset.section}"]`);
      this.form = this.querySelector('form'); 
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

        fetch("https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=TeNSXA", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
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



    closeDrawer(pElem) {
        this.activeDrawer = null;
        const faqAnswer = pElem.querySelector('[data-faq-answer]');
        faqAnswer.style.height = 0;
        pElem.querySelector('summary').setAttribute('aria-expanded', false);
    
        setTimeout(() => {
          pElem.removeAttribute('open');
        }, 450);
      }
    
    
      openDrawer(pDrawer) {
        pDrawer.setAttribute('aria-expanded', true);
      
        if (pDrawer.dataset.id == this.activeDrawer) {
          this.closeDrawer(pDrawer.closest('details'));
          return;
        }
    
        this.querySelectorAll('details').forEach((elem) => {
          if (elem.querySelector('summary').dataset.id !== pDrawer.dataset.id) {
            this.closeDrawer(elem.closest('details'));
          }
        });
    
        pDrawer.closest('details').setAttribute('open', true);
    
        const faqAnswer = pDrawer.closest('details').querySelector('[data-faq-answer]');
        faqAnswer.style.height = faqAnswer.querySelector('p').offsetHeight + 'px';
    
        this.activeDrawer = pDrawer.dataset.id;
      }
      
  }
  
  // Define the custom element name and register it
  customElements.define('back-in-stock', BackInStockComponent);