class SectionDirectionalArrow extends HTMLElement {
    connectedCallback() {
      const button = this.querySelector('button');
      button.addEventListener('click', () => {
        let currentSection = this.closest('section');
        if (!currentSection) {
          currentSection = this.closest('div').querySelector('section');
        }
  
        if (currentSection) {
          let found = false;
          let nextElement = currentSection.nextElementSibling;
  
          while (nextElement) {
            if (nextElement.tagName === 'SECTION' || nextElement.tagName === 'DIV') {
              if (nextElement.tagName === 'SECTION') {
                found = true;
                break;
              }
              if (nextElement.tagName === 'DIV') {
                const sectionInsideDiv = nextElement.querySelector('section');
                if (sectionInsideDiv) {
                  found = true;
                  nextElement = sectionInsideDiv;
                  break;
                }
              }
            }
            nextElement = nextElement.nextElementSibling;
          }
  
          if (found) {
            nextElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.error('No following section element found!');
          }
        } else {
          console.error('No section element found!');
        }
      });
    }
  }
  
  customElements.define('section-directional-arrow', SectionDirectionalArrow);