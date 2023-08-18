class GlobalModal extends HTMLElement {
    constructor() {
      super();
    
      this.modalId  = this.id; 
      this.modal = this.querySelector('[role="dialog"]'); 
      this.modalTriggers =  document.querySelectorAll(`button[data-modal="${this.modalId}"]`);
      this.close = this.querySelector('[data-modal-close]'); 
    //   this.openButton = this.shadowRoot.querySelector('#openModalButton');
    //   this.modal = this.shadowRoot.querySelector('#modal');
    //   this.closeButton = this.shadowRoot.querySelector('#closeModalButton');

    //   this.openButton.addEventListener('click', () => this.openModal());
    //   this.closeButton.addEventListener('click', () => this.closeModal());
      this.initEvents(); 
    }

    initEvents() {
        this.modalTriggers.forEach((elem)=> {
            elem.addEventListener('click', (event)=> this.openModal(event));
        });

        this.close.addEventListener('click', ()=> {
            this.closeModal(); 
        }); 
    }

    openModal(pEvent) {
     pEvent.target.closest('button').setAttribute('aria-expanded', true);
      this.modal.style.display = 'block';
      this.modal.setAttribute('aria-hidden', 'false');
    }

    closeModal() {
       this.modalTriggers.forEach((elem)=> {
         elem.setAttribute('aria-expanded', 'false');
        });

      this.modal.style.display = 'none';
      this.modal.setAttribute('aria-hidden', 'true');
    }

  }

  customElements.define('global-modal', GlobalModal);