import icons from 'url:../../img/icons.svg'; //PArcel 2

// we are not going to create any "instance" of this view. we're only going to use it as a parent class of other "child" views

export default class View {
  _data;

  /**
   * Render the received object to the DOM 
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe ) 
   * @param {boolean} [render=true]  If false create markup string instead of rendering to the DOM 
   * @returns {undefined | string} a markup string is returned if render is false 
   * @this {Object} View Instance 
   * @author Carli Smith
   * @todo Finish Implementation
   */

  //public method
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();


    if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {


    this._data = data;
    const newMarkup = this._generateMarkup();

    // generate markup will just be a string so need to convert to dom object that can live in memory "virtual dom" dom not really living on page but living in memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    // looping over 2 arrays at once
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // is equal node method to compare both elements to each other. watch begin. of dom section to see difference between elements + nodes. if it sets to false that means current element is different from the new element
      // console.log(curEl, newEl.isEqualNode(curEl));

      // updating the dom only in places where it has changed
      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('😀', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // update changed attributes (replace all attributes from current element by attributes coming from newElements )
      if(!newEl.isEqualNode(curEl))
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
