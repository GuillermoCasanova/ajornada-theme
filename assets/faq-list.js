
class FAQList extends HTMLElement {
    constructor() {
      super();
      this.activeDrawer = null;
    }
  
    connectedCallback() {
      this.init();
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
  
    toggleDrawer(event) {
      event.preventDefault();
      const currentTarget = event.currentTarget;
      this.openDrawer(currentTarget);
    }
  
    openDrawer(pDrawer) {
        console.log(pDrawer); 
        
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
  
    init() {
      this.querySelectorAll('details').forEach((elem) => {
        const summary = elem.querySelector('summary');
            summary.addEventListener('click', (e) => {
             this.toggleDrawer(e);
            });

        elem
          .querySelectorAll('[data-faq-answer]')
          .forEach((elem) => {
            elem.style.height = 0;
          });
      });
    }
  }
  
  // Define the custom element
  customElements.define('faq-list', FAQList);