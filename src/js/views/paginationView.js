import View from './View.js';
import icons from 'url:../../img/icons.svg'//PArcel 2 


class PaginationView extends View {
_parentElement = document.querySelector('.pagination');

addHandlerClick(handler){
    //event delegation because 2 buttons  so we will add event listener to its parent 
    // closest looks for closest parent. e.target = element that was clicked
    this._parentElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--inline');

        if(!btn) return;


        const goToPage = +btn.dataset.goto;
        // console.log(goToPage);



        handler(goToPage)
    })

}

// this is the method that render will call to generate markup for the v iew
_generateMarkup(){

    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // page 1 and there are other pages 
    if (curPage === 1 && numPages > 1) {
        return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span> Page ${curPage + 1} </span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }

    
    // Last page 
    if (curPage === numPages && numPages > 1) {
        return `
        <button data-goto="${curPage + -1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1} </span>
            </button>
        `;
    }
    
    // other page (middle page)
    if(curPage < numPages) {
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1} </span>
            </button>

            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span> Page ${curPage + 1} </span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    // page 1 and there are NO other pages 

    return '';
}
}

export default new PaginationView();


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