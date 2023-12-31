
if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();   
      
      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
      this.submitButton = this.querySelector('[type="submit"]');
      this.submitButton.setAttribute('aria-haspopup', 'dialog');

    }
  
    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('[data-error-message-wrapper]');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('[data-error-message]');
  
      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  
    onSubmitHandler(evt) {
      evt.preventDefault(); 

      const submitButton = this.querySelector('[type="submit"]');
  
      submitButton.setAttribute('disabled', true);
      submitButton.classList.add('loading');
      
      const body = JSON.stringify({
        ...JSON.parse(serializeForm(this.form))
      });

      const formData = new FormData(this.form);

      for (var [key, value] of formData.entries()) { 
        console.log(key, value);
      }
      
      console.log(this.form);
      console.log(body); 

  
      fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
        .then((response) => response.json())
        .then((parsedState) => {
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          document.querySelector('cart-off-canvas').open(true);
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('disabled');
        });
    }
  });
}