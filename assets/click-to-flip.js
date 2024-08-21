  class ClickToFlip extends HTMLElement {
    constructor() {
      super();

      // Get the class to be added from the attribute
      this.highlightClass = 'is-active';

      // Attach the click event listener to each element
      this.querySelector('[data-flip-trigger]').addEventListener('click', this.toggleHighlight.bind(this));
      // Attach the focus event listener to each element
      this.querySelector('[data-flip-trigger]').addEventListener('focus', this.toggleHighlight.bind(this));


      if (Shopify.designMode) {
        if (this.closest('[data-shopify-editor-section]')) {
          this.sectionId = this.closest('[data-shopify-editor-section]').id;
        }

        document.addEventListener('shopify:block:select', this.onCardBlockSelect.bind(this));
      }
    }

    onCardBlockSelect(event) {
      if (this.sectionId !== event.sectionId) {
        return;
      }
      this.toggleHighlight(event);
    }

    closeOtherCards() {
      document.querySelectorAll('click-to-flip').forEach((element) => {
        if (element.querySelector('[data-card]').classList.contains('is-active')) {
          element.querySelector('[data-card]').classList.remove('is-active');
        }
      });
    }

    toggleHighlight(pEvent) {
      let card = this.querySelector('[data-card]');
      if (card.classList.contains('is-active')) {
        card.classList.remove('is-active');
      } else {
        this.closeOtherCards();
        pEvent.target.closest('[data-flip-trigger]').querySelector('[data-card]').classList.toggle('is-active');
      }
    }
  }

  customElements.define('click-to-flip', ClickToFlip);