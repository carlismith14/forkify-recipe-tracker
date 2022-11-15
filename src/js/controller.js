import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'regenerator-runtime/runtime';
import 'core-js/stable';

// this is not js this is coming from parcel. idk what it is
// if(module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    //0 update  results view to mark selected search result 
    resultsView.update(model.getSearchResultsPage());
    
    //1 updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2 loading recipe (example of an async function running in an async function. Q about naming exports + export functions does "model" just become object name that includes all functions and the functions keep their original names?. this function won't return anything therefore not storing any result into any new variable instead we'll just get access to state.recipe
    await model.loadRecipe(id);
    
    //3 rendering recipe
    recipeView.render(model.state.recipe);
    


  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    //1. get search query ( this will also clear the search field)
    const query = searchView.getQuery();
    if (!query) return;

    //2. load search results
    // do not need to store this in a variable as all it does is manipulate state object in model
    await model.loadSearchResults(query);

    //3. render results
    //  resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4 Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// controller that will be executed whenever click on next or prev button happens in pagination
// render will overwrite markup that was previously there this is because render has clear method so before any html is inserted into the page the parent element is first cleared and then the new data being passed is displayed

const controlPagination = function (goToPage) {
  console.log(goToPage);

  //1. render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};



// controllers are just because we're using modelviewcontroller pattern they could also be called handlers because that's what they are. they are event handlers that will run whenever some event happens 

// this event will be executed whenever a user clicks on + or - serving buttons 

const controlServings = function(newServings) {

  // update recipe servings (in the state).. updating underlying data
  model.updateServings(newServings);

  
  
  // update the recipe view 
  
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}


// adding new bookmark
const controlAddBookmark = function() {

  //1. Add / remove bookmark 
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipe view 
  recipeView.update(model.state.recipe);

  //3. render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() { 
  bookmarksView.render(model.state.bookmarks)
}


const controlAddRecipe = async function(newRecipe){

  try {
    // show loading spinner 
    addRecipeView.renderSpinner();


  // upload new recipe data 
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe 
    recipeView.render(model.state.recipe);

    // success message 
    addRecipeView.renderMessage();

    // render bookmark view 
    bookmarksView.render(model.state.bookmarks);


    // change ID in URL . pushstate takes 3 parameters, 1. null 2. title also not relevant so '', 3. URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch(err) {
    console.error('😀😀😀😀', err);
    addRecipeView.renderError(err.message);
  }
  // console.log(newRecipe);
};

const newFeature = function(){
  console.log('Welcome to the application!');
}

//implementing publisher subscriber pattern 
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();

