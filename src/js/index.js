import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

// * global state of the app
// * search object
// * Current recipe object
// * Shopping list object
//  * Liked recipes
const state = {};

// Serach controller
const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput();

  if (query){
    // 2) new search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) search for recipes
      await state.search.getResults();

      // 5) render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert('smth wrong with search')
    }
  }
};

elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
  // console.log(btn);1
});

const controlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected serach item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse recipe ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      console.log(state.recipe);

      // // calc Time and calc servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      // recipeView.clearRecipe();
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert('Error processing recipe');
    }
  }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange' , 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// handling recipe btn clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-dec, .btn-dec *')) {
    // decrease btn is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-inc, .btn-inc *')) {
    // inc btn is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);
});
