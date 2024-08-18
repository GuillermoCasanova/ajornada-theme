class FAQList extends HTMLElement {
  constructor() {
    super();
    this.activeDrawer = null;
  }

  connectedCallback() {
    this.init();
    if (Shopify.designMode) {
      document.addEventListener('shopify:block:select', this.onFAQBlockSelect.bind(this));
    }
  }

  toggleDrawer(event) {
    event.preventDefault();
    this.openDrawer(event.currentTarget);
  }

  closeDrawer(pElem) {
    if (!pElem) return;

    pElem.querySelector('[data-faq-answer]').style.height = 0;
    pElem.querySelector('summary').setAttribute('aria-expanded', false);

    setTimeout(() => {
      pElem.removeAttribute('open');
    }, 450);

    this.activeDrawer = null;
  }

  onFAQBlockSelect(event) {
    event.preventDefault();
    setTimeout(() => this.openDrawer(event.target), 200);
  }

  openDrawer(pDrawer) {
    const parentDetails = pDrawer.closest('details');

    if (parentDetails && parentDetails.dataset.id === this.activeDrawer) {
      this.closeDrawer(parentDetails);
      return;
    }

    this.querySelectorAll('details').forEach(elem => {
      if (elem !== parentDetails) this.closeDrawer(elem);
    });

    if (parentDetails) {
      parentDetails.setAttribute('open', true);
      const faqAnswer = parentDetails.querySelector('[data-faq-answer]');
      faqAnswer.style.height = `${faqAnswer.querySelector('p').offsetHeight}px`;
      pDrawer.setAttribute('aria-expanded', true);
      this.activeDrawer = parentDetails.dataset.id;
    }
  }

  init() {
    this.querySelectorAll('details').forEach(detailsElem => {
      detailsElem.querySelector('summary').addEventListener('click', this.toggleDrawer.bind(this));
      detailsElem.querySelectorAll('[data-faq-answer]').forEach(answerElem => {
        answerElem.style.height = 0;
      });
    });
  }
}

customElements.define('faq-list', FAQList);
