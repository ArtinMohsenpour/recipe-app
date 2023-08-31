/////////////////////////////////// IMPORTS ///////////////////////////////////
// import icons from 'url:../img/icons.svg';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
if (module.hot) {
  module.hot.accept();
}
/////////////////////////////////// SELECTIONS ///////////////////////////////////
const recipeContainer = document.querySelector('.recipe');
const searchForm = document.querySelector('.search');
const searchContainer = document.querySelector('.search__field');
const searchButton = document.querySelector('.search__btn');
const resultsField = document.querySelector('.search-results');
const resultsList = document.querySelector('.results');
// https://forkify-api.herokuapp.com/v2

/////////////////////////////////// FUNCTIONS ///////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 0. results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    // updating bookmarks
    bookmarksView.update(model.state.bookmarks);
    //1. Load the recipe
    await model.loadRecipe(id);

    //2. Rendering recipe view
    recipeView.render(model.state.recipe);
    // debugger;
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    // 3) render search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPageage) {
  // 1) render new search results
  resultsView.render(model.getSearchResultsPage(goToPageage));

  //2) render new pagination buttons
  paginationView.render(model.state.search);
  console.log(goToPageage);
};

const controlServings = function (newServings) {
  // 1) update the recipe servings
  model.updateServings(newServings);
  // 2) update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // console.log(model.state.recipe);
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    //render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // console.log(model.state.recipe);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
// const controlAddRecipe = async function (data) {
//   try {
//     await model.uploadRecipe(data);
//   } catch (err) {
//     console.error(err);
//     addRecipeView.renderError(err.message);
//   }
// };

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
