
class SearchView {
    _parentEl= document.querySelector('.search');

    getQuery(){
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    //listen for event in view and then pass handler function from controller in. method will be publisher + control search results function will be subscriber 

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }



}

export default new SearchView();