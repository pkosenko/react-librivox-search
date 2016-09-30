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

// TEST data for no internet connection;  fetch() of json file is not working; two titles only; needs to end }]}]};
var data = {books:[{"id":"53","title":"Bleak House","description":"<p>Bleak House is the ninth novel by Charles Dickens, published in 20 monthly parts between March 1852 and September 1853. It is widely held to be one of Dickens' finest and most complete novels, containing one of the most vast, complex and engaging arrays of minor characters and sub-plots in his entire canon. Dickens tells all of these both through the narrative of the novel's heroine, Esther Summerson, and as an omniscient narrator. Memorable characters include the menacing lawyer Tulkinghorn, the friendly but depressive John Jarndyce and the childish Harold Skimpole. The plot concerns a long-running legal dispute (Jarndyce and Jarndyce) which has far-reaching consequences for all involved. (Summary from Wikipedia)<\/p>","url_text_source":"http:\/\/www.gutenberg.org\/etext\/1023","language":"English","copyright_year":"1853","num_sections":"67","url_rss":"http:\/\/librivox.org\/rss\/53","url_zip_file":"http:\/\/www.archive.org\/download\/bleak_house_cl_librivox\/bleak_house_cl_librivox_64kb_mp3.zip","url_project":"http:\/\/en.wikipedia.org\/wiki\/Bleak_House","url_librivox":"http:\/\/librivox.org\/bleak-house-by-charles-dickens\/","url_other":null,"totaltime":"43:30:19","totaltimesecs":156619,"authors":[{"id":"91","first_name":"Charles","last_name":"Dickens","dob":"1812","dod":"1870"}]},
{"id":"140","title":"Christmas Carol","description":"<p>A classic tale of what comes to those whose hearts are hard. In a series of ghostly visits, Scrooge visits his happy past, sees the difficulties of the present, views a bleak future, and in the end amends his mean ways. (Summary written by Kristen McQuillin)<p>","url_text_source":"http:\/\/www.gutenberg.org\/etext\/46","language":"English","copyright_year":"1843","num_sections":"5","url_rss":"http:\/\/librivox.org\/rss\/140","url_zip_file":"http:\/\/www.archive.org\/download\/A_Christmas_Carol\/A_Christmas_Carol_64kb_mp3.zip","url_project":"http:\/\/en.wikipedia.org\/wiki\/A_Christmas_Carol","url_librivox":"http:\/\/librivox.org\/a-christmas-carol-by-charles-dickens\/","url_other":null,"totaltime":"3:14:29","totaltimesecs":11669,"authors":[{"id":"91","first_name":"Charles","last_name":"Dickens","dob":"1812","dod":"1870"}]}]};


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
// save the current selected book data
export const SAVE_CURRENT_BOOK = 'SAVE_CURRENT_BOOK';

// Librivox API gives "404 Not Found" if no data is returned for 
// an author name. That is incorrect use of the 
// response code. But what can you do?
// If searchTerm is left blank, the API returns fifty items, 
// starting with the beginning of the librivox list.  Not 
// especially useful . . . so just cancel the search?

// Save the current book object to stores
export function saveCurrentBook(currentBook = {}) {
     console.log('Current Book Action: ' + currentBook);
     return {
     	type: SAVE_CURRENT_BOOK,
     	currentBook: currentBook
     }
}
    
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
    /*
		fetch('/users.json')
  			.then(function(response) {
    		return response.json()
  		}).then(function(json) {
    		console.log('parsed json', json)
  		}).catch(function(ex) {
    		console.log('parsing failed', ex)
  		})
    */

    // Production code:
    var searchURL = 'https://librivox.org/api/feed/audiobooks/';  // actual API   
    var searchType = 'author/';  // author last name
    var queryFormat = '?format=jsonp';
    searchURL = searchURL + searchType + searchTerm + queryFormat;
    
    
    console.log("searchURL: " + searchURL);
    // dispatch(saveSearchURL(searchURL));  // undefined?  dispatch search URL to stores
    // searchURL should be stored in the store by now???
    // jsonp(url, opts, fn){
    return (dispatch) => {
    	// For use with missing internet connection
    	/* fetch() DOES NOT WORK on books.json file
    	fetch('/react_librivox_search/books.json')
  		.then(function(response) {
  			// HUH? SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data
  			dispatch(saveBookData(response.books));
  			dispatch(saveSearchURL(searchURL));
    		return response.json()
  		}).then(function(json) {
    		console.log('parsed json', json)
  		}).catch(function(ex) {
    		console.log('parsing failed', ex);
    		dispatch(saveBookDataFetchError(ex)); 
  		});
  		*/

  		// TEST data -- variable defined above -- comment out fetch() and jsonp()
  		dispatch(saveBookData(data.books));  // data is an object, books is an array
	    dispatch(saveSearchURL(searchURL));

  		/*
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
		*/
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

