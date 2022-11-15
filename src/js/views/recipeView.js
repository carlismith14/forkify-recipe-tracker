import View from './View.js';


import icons from 'url:../../img/icons.svg'//PArcel 2 
// import {Fraction} from 'fractional';
import fracty from "fracty";

// console.log(Fraction);
// any libraries or packages we import from npm we  don't have to specify path just write names + then what they export

// view will be a class. later we will have parent class called view that will contain methods that all views should inherit we want each view to have some private methods + properties
// why parentelement # because private??

class RecipeView extends View {
    _parentElement = document.querySelector('.recipe');1
    _errorMessage = 'We could not find that recipe. Please try another one!';
    _message = '';
    
   


      // this is publisher and needs access to the "subscriber". note not a private method because needs to be part of public api. please see event handlers in MVC publisher/subscriber pattern lecture
      addHandlerRender(handler){
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
      }


      addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener('click',function(e) {
          const btn = e.target.closest('.btn--increase-servings');
          if (!btn) return;
          console.log(btn);
          const { updateTo } = btn.dataset; // camelcase because update-to dashes will be converted to camelCase 

         if (+updateTo > 0) handler(+updateTo);

        })
      }


      addHandlerAddBookmark(handler){
        this._parentElement.addEventListener('click', function(e){
          const btn = e.target.closest('.btn--bookmark');
          if (!btn) return;
          handler();
        })
      }


    _generateMarkup() {
        return  `
        <figure class="recipe__fig">
          <img src="${this._data.image}" crossOrigin="anonymous" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
  
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>
  
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
  
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>
  
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </div>
  
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
   
      `;

    }
    _generateMarkupIngredient(ing) {
        return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity ? new fracty(ing.quantity).toString(): ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`
    }

}



// no data passed in so don't need any constructor 
export default new RecipeView();