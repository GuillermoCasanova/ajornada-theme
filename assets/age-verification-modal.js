
class AgeVerificationModal extends HTMLElement {
    constructor() {
      super();

      this.ageVerified = localStorage.getItem('ageVerified');
      this.submitButtons = this.querySelectorAll('button');
      this.submitButtons.forEach((elem) => {
        elem.addEventListener('click', this.handleSubmit.bind(this));
      });

      this.modal = this.querySelector('[data-modal]');
      this.body = document.querySelector('body');

      if (!this.ageVerified) {
        this.openModal();
      }
    }

    openModal() {
      this.modal.style.display = 'block';
      this.body.style.overflow = 'hidden';
      trapFocus(this.modal);
    }
    closeModal(pPreventAnimation) {
      if(pPreventAnimation) {
          this.modal.style.display = "none"; 
          return
      }
      this.modal.classList.add('is-hidden');
      localStorage.setItem("ageVerified", "true");
      setTimeout(() => {
        this.body.style.overflow = 'visible';
      }, 200);
    }
    denyAccess() {
      this.modal.classList.add('is-blocked');
      this.body.style.overflow = 'hidden';
    }

    handleSubmit(pEvent) {
      let targetAction = pEvent.currentTarget.closest('button').dataset.action;
      if (targetAction !== 'confirm') {
        this.denyAccess();
      } else {
        this.closeModal();
      }
    }

    connectedCallback() {
      if (!this.ageVerified) {
        this.modal.style.display = "block"; 
        this.addEventListener('DOMContentLoaded', this.openModal);
      } else {
       this.closeModal(true);
      }
    }
  }

  customElements.define('age-verification-modal', AgeVerificationModal);