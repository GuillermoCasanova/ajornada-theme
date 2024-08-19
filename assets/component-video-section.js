
class VideoSection extends HTMLElement {
    constructor() {
      super();
      //this.initEvents();
      // if (this.querySelector('video')) {
      //   this.initVideo();
      // }

      this.videoLoaded = false; 
      // this.iframe = section.iframe;
      this.iframeContainer = this.querySelector('[data-iframe-container]');
      this.videoLoaded = false;
      this.initEvents(); 
    }

    initVideo() {
      window.addEventListener('DOMContentLoaded', () => {
        let mediaQueries = {
          mediumDown: window.matchMedia('(max-width: 939px)'),
          largeUp: window.matchMedia('(min-width: 940px)'),
        };

        let vidSrc = this.querySelector('video').dataset.lazySrc;
        this.video = this.querySelector('video');

        
        function startVideo(pSource, pElement) {
          pElement.querySelector('[type="video/mp4"]').src = pSource;
          pElement.load();

          setTimeout(()=> {
            pElement.closest('.image-video-banner__media').classList.add('is-loaded');
            pElement.play();
          }, 500);
        }

        startVideo(vidSrc, this.video);
      });
    }


    initEvents() {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
  
      const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.videoLoaded) {
            this.loadVideo();
            observer.unobserve(this); 
          }
        });
      };
  
      const observer = new IntersectionObserver(observerCallback, observerOptions);
      observer.observe(this);
    }

    loadVideo(e) {

      if(this.iframeContainer) {
        this.loadIframe(); 
        this.classList.add('video-loaded');
      }
      else {
        console.log('load html5 video')
        this.loadStoredVideo();
      }
    }

    toggleVideoStored() {
      if(!this.videoPlaying) {
        this.video.play(); 
        this.classList.add('video-playing');
        this.videoPlaying = true;
      } else {
        this.video.pause(); 
        this.classList.remove('video-playing');
        this.videoPlaying = false;
      }
    }

    loadStoredVideo() {
      this.videoToggle = this.querySelector('[data-stored-video-toggle]');
      this.video = this.querySelector('video'); 
      this.videoPlaying = false; 

      this.videoToggle.addEventListener('click', ()=> {
        if(this.video) {
          this.toggleVideoStored();
        }
      }); 
      if(this.video) {
        this.video.addEventListener('click', ()=> {
            this.toggleVideoStored();
        }); 
      }
    }

    loadIframe(e) {

      if(this.videoLoaded) {
        console.log('do nothing');
        return
      }

      let iframeSrc = this.iframeContainer.dataset.src;
      let iframeTitle = this.iframeContainer.dataset.title; 
  
      // // Create a new iframe element and set its src attribute
      const iframe = document.createElement('iframe');
      iframe.frameBorder = 0; 
      iframe.src = iframeSrc;
      iframe.title = iframeTitle; 

      // // Append the new iframe element to the body
      this.iframeContainer.appendChild(iframe);
  
      this.videoLoaded = true;
    }
  }

  customElements.define('video-section', VideoSection);