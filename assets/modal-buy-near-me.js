class ModalBuyNearMe extends GlobalModal {
    constructor() {
      super();
      this.modal = document.querySelector("#buy-near-me-modal");
    }

    openModal(pEvent) {
      super.openModal(pEvent); 
      console.log('hello');
      this.scrollToSection(); 
    }

    scrollToSection() {
      const offset = 150; // Replace with your desired offset value
      const targetElement = this.modal;
      const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }

customElements.define('modal-buy-near-me', ModalBuyNearMe);