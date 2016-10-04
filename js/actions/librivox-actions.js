/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * LibrivoxActions
 * 
 * librivox-actions.js
 *
 * Action type identifiers tell what actions
 * to invoke on the data. 
 * 
 * July 2016 - refactored the application to use Redux rather than Flux.
 *
 */

 import jsonp from 'jsonp';


 //  previous action type constants
 //  SAVE_LIBRIVOX_DATA   // ????
 //  UPDATE_LIBRIVOX_DATA  // When new data is returned by search


// Reddit database ajax query example uses TWO actions -- REQUEST and RECEIVE.
// This has to do with Ajax asynchronous promises . . . to make sure that the
// data is returned before proceeding with any processing logic.  But there seem
// to be other ways of doing asynchronous data updates.

// Action type constants:
// An action informing the reducers that the request began.
// The reducers may handle this action by toggling an isFetching flag in the
// state.  This way the UI knows it’s time to show a spinner.
export const REQUEST_BOOKS = 'REQUEST_BOOKS';  // start jsonp
// An action informing the reducers that the request finished successfully.
// The reducers may handle this action by merging the new data into the state 
// they manage and resetting isFetching (global?). The UI would hide the 
// spinner, and display the fetched data.
export const RECEIVED_BOOKS_SUCCESS = 'RECEIVED_BOOKS_SUCCESS';  
// jsonp succeeded
export const BOOK_DATA_FETCH_ERROR = 'BOOK_DATA_FETCH_ERROR'; // jsonp failed
// Title Filter does not actually retrieve any new data, but we want to 
// remember it as a UI state.
export const BOOK_TITLE_FILTER = 'BOOK_TITLE_FILTER';
// Get individual book from stored author listing
export const GET_BOOK = 'GET_BOOK'; 
// Save the Search URL in case needed for orepeat search, or just for information
export const SAVE_SEARCHURL = 'SAVE_SEARCHURL';

// Librivox API gives "404 Not Found" if no data is returned for 
// an author name. That is incorrect use of the 
// response code. But what can you do?
// If searchTerm is left blank, the API returns fifty items, 
// starting with the beginning of the librivox list.  Not 
// especially useful . . . so just cancel the search?
    
export function saveSearchURL(searchURL) {
	// console.log('searchURL action engaged.')
	return {
		type: SAVE_SEARCHURL,
		searchURL: searchURL
	}
}

export function getBookData (searchType = 'author/', searchTerm) {
    console.log('searchTerm: ' + searchTerm);
    if (!searchTerm) {
      // If searchTerm is "", the first 50 titles of the catalogue return;
      // Same for name search.  Max of 50 is what returns as a default. 
      // Need to check whether the API allows to reset this.
    }
    // Local testing -- JSONP will not properly load a .json file; try using built-in react fetch() method
    // see "react/node_modules/fbjs/node_modules/whatwg-fetch/README.md"
    // var searchURL = 'http://jstest.dd:8083/react_librivox_search/books3.json?callback=CALLBACK';  // Local testing
    // http://jstest.dd:8083/react_librivox_search/books.json?callback=__jp0
    // Can't figure out why this will not parse.  SyntaxError: missing ; before statement book:  (at the semicolon?)
    // bundle.js (line 21270)  SyntaxError: missing ; before statement

    // Production codee:
    var searchURL = 'https://librivox.org/api/feed/audiobooks/';  // actual API   
    var searchType = 'author/';  // author last name
    var queryFormat = '?format=jsonp';
    searchURL = searchURL + searchType + searchTerm + queryFormat;
    
    
    console.log("searchURL: " + searchURL);
    // dispatch(saveSearchURL(searchURL));  // undefined?  dispatch search URL to stores
    // searchURL should be stored in the store by now???
    // jsonp(url, opts, fn){
    return (dispatch) => {
    	jsonp(searchURL, {}, function (err, data) {
	        if (data) {
	            // console.log('data: ' + JSON.stringify(data)); 
	            // Dispatch the data to stores
	            // sdata => dispatch({ type: 'RECEIVED_BOOKS_SUCCESS', data }),
	            dispatch(saveBookData(data.books));  // data is an object, books is an array
	            // dispatch({ type: 'RECEIVED_BOOKS_SUCCESS', data }),
	            // data is the object
	            // librivoxActions.saveLibrivoxData(data);  
	            dispatch(saveSearchURL(searchURL));
	        } 
	        if (err) {
	            console.log('err: ' + err);
	            // err => dispatch({ type: 'LOAD_DATA_FAILURE', err })
	            // BOOK_DATA_FETCH_ERROR
	            dispatch(saveBookDataFetchError(err));    
	        }
    	});
    }
}


// Store the returned book data object in the application's store.
// Not sure that this should take "jsonp" as a parameter.

export function saveBookData(data) {
	return {
		type: RECEIVED_BOOKS_SUCCESS,
		data: data
	}
}

export function saveBookDataFetchError(err) {
    return {
        type: BOOK_DATA_FETCH_ERROR,
        bookDataFetchError: "Number: " + err.number + "; Description: " + err.description
    }
}

