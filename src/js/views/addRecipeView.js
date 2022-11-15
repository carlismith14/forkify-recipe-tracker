import View from './View.js';
import icons from 'url:../../img/icons.svg'//PArcel 2 


class AddRecipeView extends View {
_parentElement = document.querySelector('.upload');
_message = 'Recipe was successfully uploaded :)';


_window = document.querySelector('.add-recipe-window');
_overlay = document.querySelector('.overlay');
_btnOpen = document.querySelector('.nav__btn--add-recipe');
_btnClose = document.querySelector('.btn--close-modal');


constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();

}


toggleWindow(){
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
}

_addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
}

_addHandlerHideWindow(){
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
}


addHandlerUpload(handler){
    this._parentElement.addEventListener('submit',function(e){
        e.preventDefault();
        const dataArr = [...new FormData(this)];
    //from entries is opposite of 
        const data = Object.fromEntries(dataArr);
        handler(data);

        
    })
}

// this is the method that render will call to generate markup for the v iew
_generateMarkup(){}
};

export default new AddRecipeView();


// <!-- <button class="btn--inline pagination__btn--prev">
//             <svg class="search__icon">
//               <use href="src/img/icons.svg#icon-arrow-left"></use>
//             </svg>
//             <span>Page 1</span>
//           </button>
//           <button class="btn--inline pagination__btn--next">
//             <span>Page 3</span>
//             <svg class="search__icon">
//               <use href="src/img/icons.svg#icon-arrow-right"></use>
//             </svg>
//           </button> -->