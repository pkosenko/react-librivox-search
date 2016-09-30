
/**
 *
 * General Notes
 * 
 * Try to keep data and UI state separate.
 *
 * Before I can implement a completely flexible search of the Librivox
 * API, I will have to sit down and go through the whole Librivox database
 * export implementation.  For the time being, only author last name
 * search is implemented here.
 *
 */

import { combineReducers } from 'redux';
// import actions constants?
import * as librivoxActions from '../actions/librivox-actions';


// Reducers return state from actions

const rootLibrivoxReducer = combineReducers({
  searchURL,
  titleFilter,
  bookData, // the entire return JSON from librivox search
  currentBook  // The individual book displayed in BookDataDisplay
})

function currentBook(state = {}, action) {
  console.log('reducer currentBook was called with state', state, 'and action', action);
  switch (action.type) {
    case librivoxActions.SAVE_CURRENT_BOOK:
      return {
        // Need to return an immutable state object; state + new data
        ...state, currentBook: action.saveCurrentBook
      }
    default:
      return state;
  }
}
// This reducer saves the current search URL to the store
// The action itself calls the JSONP, which needs another action to wait on the return of data?
// Note that if you define initial state in createStore(), it overrides state default defined in
// the following reducers.
function searchURL(state = {}, action) {
  console.log('reducer searchURL was called with state', state, 'and action', action);
  switch (action.type) {
    case librivoxActions.RECEIVED_BOOKS_SUCCESS:
      return {
        // Need to return an immutable state object; state + new data
        // Need a true action for isFetching, before data has returned, but dispatch was
        // giving an error at that point?
        ...state, searchURL: action.searchURL, isFetching: false
      }
    default:
      return state;
  }
  
}

// This reducer saves the current sort filter to the store
function titleFilter(state = {}, action) {
  console.log('reducer titleFilter was called with state', state, 'and action', action);
  switch (action.type) {
    case librivoxActions.BOOK_TITLE_FILTER:
      return {
        // state; // change this to changed state
      }
    default:
     return state;
  }
}

// This reducer saves the entire returned book data object from JSONP
function bookData(state = {}, action) {
  console.log('reducer bookData was called with state', state, 'and action', action);
  // get the data from JSONP
  switch (action.type) {
    case librivoxActions.RECEIVED_BOOKS_SUCCESS:
      var newState = {
        ...state, data: action.data  // array of objects --  gets rid of the problem of passing an object down through components
        // librivoxStore.bookData.data  ????
        // state; // change this to changed state
        // this is getting to be a fucking nightmare.
        // how to we call the JSON data action?
      };
      console.log("New state: " + JSON.stringify(newState));  // an array of objects = 
      return newState;
    case librivoxActions.BOOK_DATA_FETCH_ERROR:
      return {
        ...state, bookDataFetchError: action.bootDataFetchError
      }
    default:
      return state;
  }
}

export default rootLibrivoxReducer


