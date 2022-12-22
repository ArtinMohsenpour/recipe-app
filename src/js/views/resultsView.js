import View from './view';
import icons from '../../img/icons.svg';
import { Fraction } from 'fractional';
import { async } from 'regenerator-runtime';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `Sorry, we couldn't find any recipe for your query.
  Please try again!`;
  _successMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
