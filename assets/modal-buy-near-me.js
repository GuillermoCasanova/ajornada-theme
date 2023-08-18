class ModalBuyNearMe extends GlobalModal {
    constructor() {
      super();
      this.modal = document.querySelector("#buy-near-me-modal");
    }

    openModal(pEvent) {
      super.openModal(pEvent); 
      this.scrollToSection(); 
      this.expandModal(); 
    }
    closeModal(pEvent) {
      super.closeModal(pEvent); 
      this.collapseModal(); 
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

    expandModal() {
      this.modal.style.height = this.querySelector('.modal__inner').scrollHeight + 'px';
    }

    collapseModal() {
      this.modal.style.height = 0; 
    }
  }

customElements.define('modal-buy-near-me', ModalBuyNearMe);