class LoadingScreen extends HTMLElement {
    constructor() {
        super();
        this.logo = this.querySelector('[data-loader-logo]')
        this.ageVerified = localStorage.getItem('ageVerified');
    }

    connectedCallback() {
        if (document.readyState === 'complete') {
            this.playLoadedAnim();
        } else {
            window.addEventListener('load', this.playLoadedAnim.bind(this));
        }
    }

    playLoadedAnim() {
        this.loadGSAP(); 
    } 

    alertAgeModal() {
        if(document.querySelector('age-verification-modal')) {
            document.querySelector('age-verification-modal').playAnimation(); 
        }
    }

    loadGSAP() {
        // Load GSAP from the Shopify CDN
        loadScript('https://cdn.shopify.com/s/files/1/0638/6201/4197/files/gsap.min.js?v=1694471182')
        .then(() => {
            setTimeout(() =>{
               // this.startLoadingScreenAnim(); 
            }, 800); 
        })
        .catch((error) => {
            console.log(error)
            console.error('Script loading failed! Handle this error');
        });
    }

    playFadeOutAnim() {
        let tl = gsap.timeline(); 
        this.style.pointerEvents = "none";

        tl.to(this.logo, {
            opacity: 0, 
            duration: .8,
            ease: "power1.inOut"
        });
        
        tl.to(this, {
            opacity: 0, 
            duration: 1,
            ease: "power1.inOut"
        }, "-=.6");
    }

    startLoadingScreenAnim() {
        if(this.ageVerified) {
            this.classList.add('is-loaded');
            this.playFadeOutAnim(); 
        } else {
           this.alertAgeModal(); 
            // Load ScrollTrigger Plugin from the Shopify CDN
            let tl = gsap.timeline(); 
            this.style.pointerEvents = "none";

            tl.to(this, {
                backgroundColor: 'transparent',
                ease: 'none',
                duration: 1,
                ease: "power1.inOut"
            }, "+=.5");

            tl.to(this.logo, {
                bottom: '.5rem',
                top: 'auto',
                scale: .7,
                duration: .8,
                ease: "power1.inOut"
            },"-=1")
        }
    }
}

customElements.define('loading-screen', LoadingScreen);