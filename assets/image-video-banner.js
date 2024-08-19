
class ImageVideoBanner extends HTMLElement {
    constructor() {
      super();
      this.initCursorEffect();
      this.initEvents();
      if (this.querySelector('video')) {
        this.initVideo();
      }
    }

    initVideo() {
      window.addEventListener('DOMContentLoaded', function () {
        let mediaQueries = {
          mediumDown: window.matchMedia('(max-width: 939px)'),
          largeUp: window.matchMedia('(min-width: 940px)'),
        };

        let vidSrc = document.querySelector('#hero-video').dataset.lazySrc;

        function startVideo(pSource) {
          document.querySelector('#hero-video').querySelector('[type="video/mp4"]').src = pSource;
          document.querySelector('#hero-video').load();

          setTimeout(function () {
            document.querySelector('#hero-video').classList.add('is-loaded');
            document.querySelector('#hero-video').play();
          }, 500);
        }

        startVideo(vidSrc);
      });
    }

    initEvents() {
      function smoothScrollToSection(pElementId, pOffsetPixels) {
        // Find the target section element by its ID
        const targetSection = document.getElementById(pElementId);
        // Check if the target section exists
        if (targetSection) {
          // Get the final scroll position
          const scrollPosition = targetSection.offsetTop;
          // Scroll to the target section with smooth behavior
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });
        }
      }

      this.addEventListener('click', () => {
        console.log('click');
        const sectionIdToScroll = 'brand-intro';
        smoothScrollToSection(sectionIdToScroll);
      });
    }

    initCursorEffect() {
      function setCursorToSVG(elementId, svgCode, pContainer) {
        const element = pContainer.querySelector('[data-banner-media]');

        if (element) {
          element.style.cursor = `url("data:image/svg+xml,${encodeURIComponent(svgCode)}"), auto`;
        } else {
          console.error(`Element with ID '${elementId}' not found.`);
        }
      }

      // SVG code for the cursor
      const customCursorSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="111" fill="none"><path fill="#fff" d="M7.293 110.707a1 1 0 0 0 1.414 0l6.364-6.364a1 1 0 1 0-1.414-1.414L8 108.586l-5.657-5.657a1 1 0 1 0-1.414 1.414l6.364 6.364ZM7 0v110h2V0H7Z"/></svg>
          `;

      // Add event listener to the target element
      const targetElement = this.querySelector('[data-banner-media]');

      if (targetElement) {
        targetElement.addEventListener('mouseenter', () => {
          setCursorToSVG('targetElement', customCursorSVG, this);
        });

        targetElement.addEventListener('mouseleave', () => {
          targetElement.style.cursor = 'auto';
        });
      } else {
        console.error('Target element not found.');
      }
    }
  }

  customElements.define('image-video-banner', ImageVideoBanner);