class DirectionalArrow extends HTMLElement {
    connectedCallback() {
        function smoothScrollToSection(pElement, pOffsetPixels) {
            // Find the target section element by its ID
            const targetSection = pElement;
            // Check if the target section exists
            if (targetSection) {
                // Get the final scroll position
                const scrollPosition = targetSection.offsetTop;
                // Scroll to the target section with smooth behavior
                window.scrollTo({
                top: scrollPosition - pOffsetPixels,
                behavior: 'smooth',
                });
            }
        }


      this.addEventListener('click', () => {
        let currentSection = this.closest('.shopify-section');
        let nextElement = currentSection.nextElementSibling; 
        smoothScrollToSection(nextElement, 60); 
      });
    }
}
  
customElements.define('directional-arrow', DirectionalArrow);
  