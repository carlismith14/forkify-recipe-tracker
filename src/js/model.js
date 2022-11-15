// import * from 'regenerator-runtime';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

//this will now contain the recipe into which controller will use, this will work because there is live connection between exports + imports. when state gets updated by loadrecipe the state is also updated in the controller which imports the state. state contains all data we need in order to build our application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //conditionally add properties to an object using short circuiting
    ...(recipe.key && {key:recipe.key}),
  };
};


// this function will not return anything all it will do is to change/fill in our "state" object above. this function will be responsible forfetching our data from forkify api
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);


    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err} =!!!`);
    throw err;
  }
};

// page 1 -1 = 0, 0 X 10 = 0
// page 1 X 10 = 10 and then slice does not include last value past in so it will extract all the way through to 9

// page 2 -2 = 1  * 10 = 10 (start at index 10 (result #11))
// page 2 X 10 = 20 (end at index 19 which is result #20)

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

// create function that will be exported so it can be used/called by the controller
//url may have changed since updated api came out. for now this works but look into whether or not this should be updated
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key:rec.key})
      };
    });

    console.log(state.search.results);

    // make sure that page always resets at 1 whenever there is a new search
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} =!!!`);
    throw err;
  }
};

// reach into the state and then change quantity of each ingredient
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    // new Qt  =  oldQt * (newServings / oldServings)
    // example  2oldQt *  (8news / 4olds) =  4newQt
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark  ( set new property "bookmarked" on the recipe object)
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try{
  // console.log(Object.entries(newRecipe));
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim())

      if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use correct format :)');

      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

    const recipe  = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);

  } catch(err){
    throw err;
  }




};
