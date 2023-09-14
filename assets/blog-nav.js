class BlogNav extends HTMLElement {
    constructor() {
        super();
        this.setUpEvents(); 
    }

    setUpEvents(event) {
        // const targetId = event.target.getAttribute('href').substring(1);
        // const targetElement = document.getElementById(targetId);

        // if (targetElement) {
        //     window.scrollTo({
        //         top: targetElement.offsetTop,
        //         behavior: 'smooth'
        //     });
        // }

        let links = this.querySelectorAll('href'); 

        links.forEach((elem) => {
            elem.addEventListener('click', (event)=> {
                let id = event.target.id; 
                window.scrollTo({
                    top: id.offsetTop,
                    behavior: 'smooth'
                });

            })
        })
    }
}

customElements.define('blog-nav', BlogNav);