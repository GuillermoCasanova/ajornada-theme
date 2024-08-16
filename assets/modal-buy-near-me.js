class ModalBuyNearMe extends GlobalModal {
    constructor() {
      super();
      this.modal = document.querySelector("#buy-near-me-modal");
      this.modal.style.display = "none";
            
      this.mediaQueries = {
        mediumUp: window.matchMedia('(min-width: 700px)'),
        largeUp: window.matchMedia('(min-width: 940px)')
    }
    
    }

    openModal(pEvent) {
      super.openModal(pEvent); 

      if(this.mediaQueries.largeUp.matches === true) {
        this.scrollToSection(); 
        this.expandModal(); 
      }
    }
    closeModal(pEvent) {
      super.closeModal(pEvent); 
      if(this.mediaQueries.largeUp.matches === true) {
        this.collapseModal(); 
      }
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