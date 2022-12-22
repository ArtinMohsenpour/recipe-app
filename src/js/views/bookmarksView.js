import View from './view';
import icons from '../../img/icons.svg';
import { Fraction } from 'fractional';
import { async } from 'regenerator-runtime';
import previewView from './previewView.js';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet!`;
  _successMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
