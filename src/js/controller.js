import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import View from './views/view.js';
import { MODAL_CLOSE_SEC } from './config.js';
//******************************************************/

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

//******************************************************/

if (module.hot) {
  module.hot.accept();
}
//******************************************************/

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    //0.Update results page
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1. load recipe
    await model.loadRecipe(id);

    //2.render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};
//******************************************************/

const controlSearchResult = async function () {
  try {
    //1. get the search query
    const query = searchView.getQuery();
    if (!query) return;
    //2.load the search results
    await model.loadSearchResult(query);

    //3. render results view
    resultsView.render(model.getSearchResultsPage());

    //4.render the pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError();
  }
};
//******************************************************/

const controPagination = function (gotoPage) {
  //3. render results view
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //4.render the pagination
  paginationView.render(model.state.search);
};

//******************************************************/

const controlServings = function (newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//******************************************************/

const controAddNewBookmark = function () {
  //1.add/ remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //2. update recipe view
  recipeView.update(model.state.recipe);

  //3.render bookmarks(show them)
  bookmarksView.render(model.state.bookmarks);
};

//******************************************************/

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
//******************************************************/

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //render message
    addRecipeView.renderMessage();
    // render bookmark
    bookmarksView.render(model.state.bookmarks);
    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
//******************************************************/
const test = function () {
  console.log('wellcomeeeee');
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controAddNewBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  // controlServings();
  test();
};
init();
