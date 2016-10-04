/*
 * Store
 *
 * July 2016 - refactored app to use Redux rather than Reflux
 *
 * A store holds the state tree of the application.
 * To create it, pass the root (combined) reducing function 
 * to createStore.  Redux uses only ONE store.
 *
 * Store Methods:
 *
 *  getState()
 *  dispatch(action)
 *  subscribe(listener)
 *  replaceReducer(nextReducer)
 *
 * createStore(reducer, [preloadedState], [enhancer])
 *
 * https://github.com/reactjs/redux/blob/master/docs/api/createStore.md
 *
 * reducer:         the ONE combined reducer
 * preloadedState:  the initial state
 * enhancer:        hmmm . . . function . . .  to "enhance" store? Apply 
 *                  multiple enhancers using compose().
 *
 * NOTE: I will need to do this, since the app will not have bona fide
 * data until the Librivox site has been queried:
 * "When a store is created, Redux dispatches 
 * a dummy action to your reducer to populate the store with the initial state.
 * You are not meant to handle the dummy action directly. Just remember that 
 * your reducer should return some kind of initial state if the state given to 
 * it as the first argument is undefined, and you’re all set."
 *
 * appState -- The composite reducer that represents the complete appState.
 *             
 */


import { createStore, applyMiddleware } from 'redux'
import rootLibrivoxReducer from '../reducers/reducers.js';
import thunk from 'redux-thunk';  // "thunk" is right


// function createStore(reducer, initialState, enhancer) . . .  if initialState not supplied is there a default Initial State?
// needs to be the same object configuration as the supplied reducers
// https://github.com/reactjs/redux/blob/master/docs/api/createStore.md 
// What should the default URL be?
// The following actually initializes all stores state .  . . so good so far.  But is it needed?
let initialState = { 
	searchURL: {searchURL: "https://www.librivox.org", isFetching: false },
	titleFilter: "",
	bookData: { data: [], lastUpdated: null }
};

// let storeDefault = null;  // turns state completely null and nothing displays
// if storeDefault is left undefined, the same also occurs -- no display.
// omitting the parameter from the function causes:   {"searchURL":{},"titleFilter":{},"bookData":{}}

// createStore(reducer, [preloadedState], [enhancer])   // applyMiddleware is third
// Could be the following
// var store = createStore(reducer, initialState, applyMiddleware(thunk));

// thunk functions like a filter on dispatch actions.  It delays the dispatch if the action returns a function (rather than a pure object)
let librivoxStore = createStore(rootLibrivoxReducer, initialState, applyMiddleware(thunk));

export default librivoxStore
/* 

 // send the data to the store
store.dispatch(action1('Read the docs'))
store.dispatch(action2('Read about the middleware'))

*/