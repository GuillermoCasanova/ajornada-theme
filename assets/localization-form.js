
class LocalizationForm extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        panel: this.querySelector('.disclosure__list-wrapper'),
        languages: this.querySelectorAll('button')
      };
      this.configure(); 
    }

    getLanguages() {
        let languages = []; 
        this.elements.languages.forEach((elem)=> {
            let language = {
                primary: JSON.parse(elem.dataset.primary), 
                iso_code: elem.dataset.value.replace('-BR', ''),
                current:  JSON.parse(elem.dataset.current || false) 
            }
            languages.push(language); 
        }); 
        return languages; 
    }

    redirectUrlBuilderFunction(primaryLocale) {
        let useInternationalDomains = false;
        var shopDomain = window.location.origin;
        if (window.Shopify && window.Shopify.designMode) {
            //shopDomain = 'https://ajornada.myshopify.com';
        }
        var currentLocale = this.getLanguages().find(function (x) { return x.current; }).iso_code.toLowerCase();
        var currentLocaleRegEx = new RegExp('^\/' + currentLocale, "ig");
        var primaryLocaleLower = primaryLocale.toLowerCase();
        var pathname = window.location.pathname;
        var queryString = window.location.search || '';
        return function build(redirectLocale) {
            if (!redirectLocale) {
            return null;
            }
            var redirectLocaleLower = redirectLocale.toLowerCase();
            if (currentLocale !== redirectLocaleLower) {
            if (useInternationalDomains) {
                var languageList = this.getLanguages();
                var internationalDomain = languageList.find(function (x) { return x.iso_code.toLowerCase() === redirectLocaleLower; });
                if (internationalDomain) {
                return 'https://' + internationalDomain.domain + pathname + queryString;
                }
            }
            else {
                if (redirectLocaleLower === primaryLocaleLower) {
                return shopDomain + pathname.replace(currentLocaleRegEx, '') + queryString;
                } else if (primaryLocaleLower === currentLocale) {
                return shopDomain + '/' + redirectLocaleLower + pathname + queryString;
                } else {
                return shopDomain + '/' + pathname.replace(currentLocaleRegEx, redirectLocaleLower) + queryString;
                }
            }
            }
            return null;
        }
    }

    configure() {
        var languageList = this.getLanguages(); 
        var primaryLanguage = languageList.find(function (x) { return x.primary; });
        var redirectUrlBuilder = this.redirectUrlBuilderFunction(primaryLanguage.iso_code);

        // Check local storage for selected langauge and set it as the default locale on page load

        // if(primaryLanguage.iso_code !== localStorage.getItem('selected-lang')) {
        //     var redirectUrl = redirectUrlBuilder(localStorage.getItem('selected-lang'));
        //     redirectUrl && window.location.assign(redirectUrl);
        // }

        // if (!primaryLanguage || !primaryLanguage.iso_code) {
        //     return;
        // }

       function languageChangeCallback(lang, elementText) {
           console.log('new language set')
       }

        this.elements.languages.forEach(function(el) {
            el.addEventListener('click', (event) => {
                let elem = event.currentTarget; 
                languageChangeHandler(elem.dataset.value.replace('-BR', ''), elem.children[0].innerText, languageChangeCallback)();
            }); 
        });

        function languageChangeHandler(languageCode, elementText, callback) {

            var selectedLanguage = languageList.find(function (language) { return language.iso_code.toLowerCase() === languageCode.toLowerCase() });
            
            console.log(selectedLanguage); 

            return function () {
                    callback(selectedLanguage, elementText);
                    localStorage.setItem('selected-lang', selectedLanguage.iso_code);
                    var redirectUrl = redirectUrlBuilder(selectedLanguage.iso_code);
                    console.log(redirectUrl); 
                    redirectUrl && window.location.assign(redirectUrl);
                }
        } 
    }
  }

customElements.define('localization-form', LocalizationForm)





