
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
      this.hideLoadingScreen(); 
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

    hideLoadingScreen() {
      if(document.querySelector('loading-screen')) {
        document.querySelector('loading-screen').playFadeOutAnim(); 
      }
    }

    playAnimation() {
        // Load GSAP from the Shopify CDN
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/gsap.min.js?v=1694471182')
        .then(() => {

          this.tl = gsap.timeline(); 

         // Animate the logo
          this.tl.fromTo("[data-brand-logo]", {opacity: 0}, {
            duration: .8,
            opacity: 1,
            ease: "power1.out"
          });

          // Animate the text elements
          this.tl.fromTo("[data-text]", {opacity: 0}, {
            duration: 0.8,
            opacity: 1,
            ease: "power1.out"
          }, "-=0.1"); // Start slightly before the logo animation finishes
          
        })
        .catch(() => {
          console.error('Script loading failed! Handle this error');
        });
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

      this.addEventListener('loading-finished', ()=> {
        this.animate(); 
      });
    }
  }

  customElements.define('age-verification-modal', AgeVerificationModal);