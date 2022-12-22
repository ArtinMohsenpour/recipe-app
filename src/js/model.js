import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX, sendJson } from './helper.js';
import { AJAX } from './helper.js';

//******************************************************/
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

//******************************************************/

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};
//******************************************************/
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    // console.error(`${err}, pay attention!`);
    throw err;
  }
};
//******************************************************/

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
//******************************************************/

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};
//******************************************************/

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(element => {
    element.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
  // console.log(state.recipe);
};

//******************************************************/

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
//***************************************************

export const addBookmarks = function (recipe) {
  //1. add to bookmark
  state.bookmarks.push(recipe);

  //2. mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};
//******************************************************/

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

//***************************************************

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Input format not currect');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

//***************************************************

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
