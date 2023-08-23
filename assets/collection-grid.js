
class CollectionGrid extends HTMLElement {
  constructor() {
      super(); 
      this.totalCollectionProducts = [];
      this.section = 1; 
      this.paginateBy = parseInt(this.dataset.paginateBy);
      //window.history.replaceState(null, null, null);
  }




  getproductThumbTemplate(pProductData) {

    console.log(pProductData);

    let collectionUrl = this.getCollectionURL(); 
    let sectionId = this.getSectionId(); 

    function getImageHTML(pData, pImage) {

      if(!pImage) {
        return 
      }

      let images = pData.media; 

      let imageObject = document.createElement('img'); 

      imageObject.alt = pData.title; 
      imageObject.setAttribute('aria-hidden', true); 
      imageObject.setAttribute('loading', 'lazy'); 
      imageObject.width = images.width;
      imageObject.height = images.height; 
      imageObject.sizes = "(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"; 
      imageObject.classList.add('reduce-motion'); 
      imageObject.src = images[0].src.slice(0, images[0].src.indexOf('?') + 1) + 'format=pjpg&' + images[0].src.split("?").pop() + "width=" + 100;
      
      function getSrcSet(pImage) {

        let sizes = [165, 360, 533, 720, 940, 1066, 2000]; 
        let srcset = ""; 

        sizes.forEach((pSize, index) => {
          let formattedURL = pImage.src.slice(0, pImage.src.indexOf('?') + 1) + 'format=pjpg&' + pImage.src.split("?").pop() + "&width=" + pSize + " " + pSize + "w"; 
          if(index !== sizes.length - 1) {
            formattedURL = formattedURL + ","
          }
          srcset = srcset + formattedURL; 
        }); 

        return srcset

      }

      imageObject.srcset = getSrcSet(pImage); 

      return imageObject.outerHTML; 

    }

    function checkSoldOut(pThumbProductData) {
          if(pThumbProductData.available === true) {
              return false
          } else {
              return true
          }
    }

    function checkOnSale(pThumbProductData) {
      console.log(pProductData);
      if(pThumbProductData.compare_at_price > pThumbProductData.price) {
        return true
    } else {
        return false
    }
    }


    return `
    <li class="grid__item" data-product-id="${pProductData.id}">
      <div class="product-card-wrapper underline-links-hover" data-product-card-wrapper="" data-section="${sectionId}-${pProductData.id}">
        <div data-product-card="" data-section="${sectionId}-${pProductData.id}" class="product-card  ">
          <div class="product-card__inner">
              <div class="product-card__media">
                <div class="product-card__badge">
                  <span class="product-card__badge-text product-card__badge__text--sold-out  ${checkSoldOut(pProductData) ? ' is-visible': ' is-hidden' }">Sold out</span>
                  <span class="product-card__badge-text product-card__badge__text--on-sale  ${checkOnSale(pProductData) ? ' is-visible' : ' is-hidden' }">On Sale</span>
                </div>
                  
                  <a title="Shop ${pProductData.title}" rel="internal" href="${collectionUrl}/products/${pProductData.handle}" class="media media--square" data-product-images="" data-section="${sectionId}-${pProductData.id}"> 
                    ${getImageHTML(pProductData, pProductData.media[0])}
                    ${getImageHTML(pProductData,  pProductData.media[1])}
                  </a>
              </div>
          </div>
      
          <div class="product-card__content">
            <a title="Shop ${pProductData.title}" rel="internal" href="${collectionUrl}/products/${pProductData.handle}" tabindex="-1" class="product-card__information">
              
              <h3 class="product-card__heading" id="title-${sectionId}-${pProductData.id}">
                  ${pProductData.title}
              </h3>
              
              <div class="product-card__price-info">
                
                <div class="price product-card__price ${pProductData.price < pProductData.compare_at_price ? ' price--on-sale' : ''}">
                  <div class="price__container">
                  
                   <div class="price__regular">
                      <span class="visually-hidden visually-hidden--inline">Regular price</span>
                      <span class="price-item price-item--regular">
                        ${new Shopify.currency().formatMoney(pProductData.price)}
                      </span>
                    </div>
                    <div class="price__sale">
                        <span class="visually-hidden visually-hidden--inline">Regular price</span>
                          <span class="price-item price-item--regular">
                        ${new Shopify.currency().formatMoney(pProductData.compare_at_price)}
                          </span>
                          
                          <span class="visually-hidden visually-hidden--inline">Sale price</span>
                      <span class="price-item price-item--sale price-item--last">
                        ${new Shopify.currency().formatMoney(pProductData.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        
    
      </div>
  </li>
    `; 
  }


  getProductsFromJson(pJSON) {
    let products = []; 
    let rawData = JSON.parse(pJSON).products;

    rawData.forEach((element)=> {

      if(element.collections == null || element.tags == undefined) {
        return
      }
      
      let productObject  = element.product || element; 
      productObject.collections = element.collections;
      productObject.options_with_values = element.options_with_values; 
      productObject.metafields = element.metafields; 
      products.push(productObject)
    }); 

    return products; 
  }
  
  renderMoreProducts() {

    
    if(this.totalCollectionProducts.length <= 0) {
      this.totalCollectionProducts = this.getProductsFromJson(document.querySelector('#product-data').textContent.trim()); 
      this.totalProductsShowing = this.totalCollectionProducts.length < 8 ? this.totalCollectionProducts.length : this.paginateBy 
    }
    
    this.section += 1

    // window.history.replaceState({page: this.section}, '', '?page_num=' + (this.section += 1));
    // const url = `${window.location.pathname}?page=${this.section}&?section_id=main-collection-product-grid`;
    // const queryUrl = new URL(window.location.href); 

    // params.delete('page_num');
    // // queryUrl.search = `?sort_by=${sortingType}`; 

    let collectionProductsContainer = this.querySelector('ul'); 
    let productsToShow = []; 

    document.querySelector('load-more-products-button').showLoadState(); 

    productsToShow = this.totalCollectionProducts.slice(this.totalProductsShowing, this.section * this.getPagination()); 


    
    setTimeout(()=> {
      document.querySelector('load-more-products-button').hideLoadState(); 
      
      productsToShow.forEach((element)=> {
        let productThumb = this.getproductThumbTemplate(element); 
        collectionProductsContainer.insertAdjacentHTML('beforeend', productThumb); 
       });

      this.totalProductsShowing = this.totalProductsShowing + productsToShow.length

      this.checkIfPaginationNeeded(this.totalProductsShowing,  this.totalCollectionProducts.length); 

    }, 200); 
    
  }

  renderProducts(pProductsToShow, pSorting) {
      console.log(pProductsToShow); 
       let collectionProductsContainer = this.querySelector('ul'); 

      collectionProductsContainer.innerHTML = '';

      this.totalCollectionProducts = pProductsToShow; 
      this.totalProductsShowing = this.paginateBy;
      
      pProductsToShow.slice(0, this.paginateBy).forEach((element)=> {
        let productThumb = this.getproductThumbTemplate(element); 
        collectionProductsContainer.insertAdjacentHTML('beforeend', productThumb); 
       });
       
      this.checkIfPaginationNeeded(this.totalProductsShowing, this.totalCollectionProducts.length); 


  }

  checkIfPaginationNeeded(pProductsRendered, pTotalProducts) {
    if(document.querySelector('load-more-products-button')) {
      if(pProductsRendered >= pTotalProducts) {
        document.querySelector('load-more-products-button').hide(); 
      } else {
        document.querySelector('load-more-products-button').reset(); 
      }
    }

  }

        
  resetCollectionGrid() {
      this.totalCollectionProducts = []; 
      this.section = 1;
      this.totalProductsShowing = this.totalProducts.slice(0, this.paginateBy);
      //this.setUpPagination(this.totalProductsShowing.length); 
      document.querySelector('load-more-products-button').reset(); 
    }


  getTotalProducts() {
    return this.totalProducts; 
  } 
  getProductsRendered() {
    return this.totalProductsShowing; 
  } 
  
  getTotalPages() {
      return  Math.round(this.totalProducts.length / this.paginateBy); 
    }
  
    getPagination() {
      return this.dataset.paginateBy; 
    }
  
    getCollectionURL() {
      return this.dataset.collectionUrl; 
    }
  
    getSectionId() {
      return this.dataset.sectionId; 
    }

}


customElements.define('collection-grid', CollectionGrid); 