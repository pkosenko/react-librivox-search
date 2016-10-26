
// ES6 import syntax
import React from 'react';
import librivoxStore from './js/stores/librivox-store';
import * as librivoxActions from './js/actions/librivox-actions';  // This is not importing correctly?
import ReactDOM from 'react-dom';  // Why not directly from React?
import { Router, Route, Link, /* browserHistory,*/ IndexRoute } from 'react-router';  // unless we plan on using redux-react-router
import { Provider, connect } from 'react-redux';
import { useRouterHistory } from 'react-router';
// import { createHistory } from 'history';  // vs. from 'history' -- react-router has its own history
// createHistory should not be used, according to Dan Abramov; intended for internal router workings
// import createBrowserHistory from 'react-router'; // does not work, gives 'createHistory is not a function' error.  Undefined.
import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';
// import createHashHistory from 'react-router/node_modules/history/lib/createHashHistory';  // causes error : Warning: [react-router] Location "/" did not match any routes




// The top-level Provider is what allows us to `connect` components to the 
// store using ReactRedux.connect -- 

// Search Filter input box -- this component is not being used yet.
// Uncontrolled component -- no initial input value specified
// Do not set value on a changeable input; results in immutable property. 
// Use defaultValue="value" to initialize instead.

// Conversion to ES6 classes: 
// https://toddmotto.com/react-create-class-versus-component/
// It seems that React.createClass() supplies property initialization
// methods that aren't there in the class extension syntax.
// From ReactClass.js (explains all props and methods of React.createClass()):
// "ReactClasses doesn't have constructors. Instead, they use the
// getInitialState and componentWillMount methods for initialization."
// React.createClass() is still usable, but WHEN should one use 
// "class ClassName extends React.Component()"?
// Look at ReactComponent.js.

// Get state: store.getState()


var SearchFilter = React.createClass({

  // createClass vs Class constructor

  getInitialState: function() {
    // console.log("this:" + JSON.stringify(this.parent)); // this = ""
    return {searchTerm: ""};  // Search box is initialized blank.
  },
  handleChange: function(event) {
    // This just sets the input data associated with the text box. event is change on the Input box.
    this.setState({searchTerm: event.target.value});
    console.log("this.state.value: " + this.state.value);
  },
  componentWillUpdate : function () {
      // console.log("this:" + JSON.stringify(this)); // this = ""
  },
  render: function() {
    // var value = this.state.value;
    // Need to add "className" to the component HTML so that style can be configured.
    return (
       <div>
          <label>Author Last Name: </label>
          <input type="text" placeholder="Search" onChange={this.handleChange} />
       </div>
    );
  }
});

var BookDataDisplay = React.createClass({
    // This is for display of individual book entries in the individual book pane
    // props.book.authors is being passed into the component
    // Try to retrieve data from redux store
    /* doesn't work
    contextTypes: {
      store: React.PropTypes.object  // is this object or array of objects?
    },
    */
    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object),  // grabs the data -- but do we need this here
      currentBook: React.PropTypes.object,
      id: React.PropTypes.string        // I take it that parameters are going to come in as strings, even if they are numbers
    },
    /*
    contextTypes: {
      router: React.PropTypes.func
    },
    */
    /*
Warning: Failed Context Types: Invalid context `router` of type `object` supplied to `BookListItem`, expected `function`. Check the render method of `SearchResultsDisplay`.
console.error(message);
bundle.js (line 2734)
Warning: Failed Context Types: Invalid context `router` of type `object` supplied to `BookDataDisplay`, expected `function`. Check the render method of `App`.
    */
    getInitialState: function() {
      return {authors: ""};
    },
    componentWillMount : function() {
      // get book data from stores.  Initial state of this.props is {}
      // this.props.data = librivoxStore.getState();
      console.log('BookDataDisplay PROPS: ' + JSON.stringify(this.props));
      // console.log("this.getParams().id: " + this.getParams().id);
      // this.context.store.getState(); // this is going to be the whole store!!!  But all we want is the ONE
      // BOOK to display
      // console.log('BookDataDisplay from stores: ' + JSON.stringify(this.context.store)); // doesn't work
      // console.log('params.id: ' + this.props.params.id);  // params undefined causes whole app blank out
      // assemble the composite author string from retrieved book data
    },
    render: function() {
        // Needs to use React routing.
        // Display should be based on ID of the book.  If no id is passed in the URL
        // parameters, the link has not been clicked, and the element should not be displayed
        /*
        if (this.props.params == undefined) {
          return null;
        }
        */
        // something wrong with this.props.currentBook.id
        // What the fuck?  this.props.params is undefined?  react-router refuses to pass on the data

        return (
           <div className='book-data'>
               <p>BOOK ID: {this.props.id}</p>
               <p>AUTHOR(S): {this.state.authors}</p>
               <p>Title: {}</p>
           </div>
        );
    }
});


var SearchResultsDisplay = React.createClass({
    // book data is now grabbed from librivoxStore module

    // When the Search component was changed to be a child of App, this,props stopped being craeated for this component.
    // Not being passed down?

    // Error: Objects are not valid as a React child (found: object with keys {data, searchTerm}). If you meant to 
    // render a collection of children, use an array instead or wrap the object using createFragment(object) from 
    // the React add-ons. Check the render method of `SearchResultsDisplay`.

    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object),  // grabs the data -- but do we need this here
      currentBook: React.PropTypes.object,
      id: React.PropTypes.number        // I take it that parameters are going to come in as strings, even if they are numbers
    },
    getDefaultProps: function() {
      return {
        data: []
      }
    },
    onChange: function () {
        return {
            // see below, where we passed in searchTerms as a prop
            // to this display component
            // data: librivoxStore.getLibrivoxData()  // get the data from stores  // func no longer defined.
        }
    },
    getInitialState: function () {
       return {
            data: this.props.data  // set as this.state.data
        }
    },
    componentDidMount: function() {
        // Why are we listening to THIS component for any change?  Need
        // to read this again.  What we need to be listening for is a change 
        // of the book
        // catalog data in the librivoxStores object, which should THEN trigger 
        // a RE-RENDER
        // of this component.
        // ERROR: addChangeListener not a function
        /* librivoxStore.addChangeListener(this.onChange);  // added after first render */ 
        // console.log("librivoxStore: " + JSON.stringify(librivoxStore));  // == {}
        // console.log("bookSearchUrl: " + librivoxStore.bookSearchUrl); // undefined?

        // console.log('librivoxStore: ' + JSON.stringify(librivoxStore.getState()));   // no dlue

    },
    componentWillUnmount: function() {
        // librivoxStore.removeChangeListener(this.onChange);  // removed before destruction //
    },
    render: function () {
        var numBooks = this.props.data.length; // this.props.data.books.length;  // this.props.data.books.length;  // not working?
        // Nesting array display gets difficult, but requires using map()
        // if no array data, return only the Search Term and number of records display (0); could be written differently.
        if (this.props.data.length < 1) {  
            return (
              <div>
              <p>Search Term: {this.props.searchTerm}</p>
              <p>Number of Author Records: {numBooks}</p>
              </div>
              );  
        }
        // See dynamic children documentation -- these are required to have keys.
        // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        // https://facebook.github.io/react/docs/create-fragment.html
        /*
              <p> ################ <br/>
              {this.props.children} <br/>  <-- no children defined or displayed when this included
               ################ </p>
        */
        return (
            <div>
              <p>Search Term: {this.props.searchTerm}</p>
              <p>Number of Author Records: {numBooks}</p>
              <p>************************************</p>
                  {this.props.data.map(function(bookObject){
                    // Will setting a component key work here?  ID number is unique in the catalog
                    return <BookListItem bookObject={bookObject} key={bookObject.id} />;
                  })}
              <p>{ /* JSON.stringify(this.props.data) */ }</p> 
            </div>
        );
    }
});

var BookListItem = React.createClass ({
 
 propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object),  // grabs the data -- but do we need this here
      currentBook: React.PropTypes.object,
      id: React.PropTypes.string        // I take it that parameters are going to come in as strings, even if they are numbers
    },  /*
  contextTypes: {
    router: React.PropTypes.func
  },
  */

  /*
  Warning: Failed Context Types: Invalid context `router` of type `object` 
  supplied to `BookListItem`, expected `function`. Check the render method of `SearchResultsDisplay`.
  AND:
  Warning: BookListItem: context type `router` is invalid; it must be a function, usually from React.PropTypes.
  */
  /*
  getDefaultProps: function() {
  // Causes error? -- TypeError: prevComponentInstance is null ?
    return {
       bookObject: {}
    }
  },
  */
  handleClick: function () {
    // alert('Item Clicked');  // works
    dispatch(saveCurrentBook(this.props.bookObject));
    alert(); // don't know if this will work her (get stores data)
  },
  // "params={{ id: bookObject.id}}"" in LINK does NOT pass parameters
  // how to set an action on LINK?
  // When handleClick dispatch is fixed, browserHistory URL linking is broken -- see history= useRouterHistory(createBrowserHistory)
  // "NetworkError: 404 Not Found - http://jstest.dd:8083/react_librivox_search/book/53"
  // <p><Link to={"/book/" + bookObject.id}  onClick={this.handleClick}>DISPLAY FULL BOOK DATA</Link></p>
  // link "/" also does not work -- turns up "no location" -- even if route is redefined -- React is totally fucked up
  // if "to" is removed, no link display


  render: function () {
    var bookObject = this.props.bookObject;
    return (
      <div>
        <p>BOOK ID: {bookObject.id}</p>
        <p>AUTHOR(S): {bookObject.authors[0].first_name + ' '  + bookObject.authors[0].last_name}</p> 
        <p>TITLE: {bookObject.title}</p>
        <p><Link to={"/book/" + bookObject.id} onClick={this.handleClick}>DISPLAY FULL BOOK DATA</Link></p>
        <p>************************</p>
      </div>   
    )  
  }
});

/*   

to={"/book/" + bookObject.id}

Notice that the data always returns a maximum of 50 records. That is the default.  Also, returns all last names, so that requires a separate first name
filter to limit the search results.   BUT it first returns a mixed bag of authors with 50 max . . . so it might be chopping names off the end, unless
there is some other sort of single author complex search that can be done.

books are objects in the array and need to be mapped.
BOOK ID:

AUTHORS(S):  // this is an array that is also going to need to be mapped

TITLE:

DISPLAY FULL BOOK DATA

 Will this RECOMPILE WHEN SAVED?  Is --watch working?
        <ul>
          {this.props.list.map(function(listValue){
            return <li>{listValue}</li>;
          })}
        </ul>

        <ul>
          {this.props.data.map(function(bookObject){
            return <li>{bookObject.title}</li>;
          })}
        </ul>


*/

// Application Wrapper
var App = React.createClass({
    // Setting proptypes for data on wrapper class doesn't per se solve the problem of missing search list data.
    // You also have to pass down the properties to child components in the component tag.
    // Does this need to have the whole store as a prope?
    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object),  // grabs the data -- but do we need this here
      currentBook: React.PropTypes.object,
      id: React.PropTypes.string        // I take it that parameters are going to come in as strings, even if they are numbers
    },
    getDefaultProps: function() {
      return {
        data: [],
        currentBook: {},
        id: 0
    }
  },

  // We can pass the whole data array, but how doesn BookDataDisplay pick up params?
  render: function() {
    return ( 
      <div>
        <Search data={this.props.data} />
        <BookDataDisplay data={this.props.data}/>
      </div>    
    )
  }
});

// Basic application component -- but should data be at wrapper level?  Do do we need to repeat propType
// definitions here?
var Search = React.createClass({
    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object) // data is object  //  data.books is array
    },
    getDefaultProps: function() {
      return {
        data: []        // 
      }
    },
    getInitialState: function () {
        return {
            // data: [],  // but how to initialize this.props.data?
            searchTerm: ""  // set as this.state.searchTerm
        }
    },
    componentDidMount() {
        console.log("Props: " + JSON.stringify(this.props));
        // Initial Props: {"history":{},"location":{"pathname":"index.html","search":"","hash":"","state":null,
        // "action":"POP","key":"ix8waa","basename":"/react_librivox_search/","query":{},"$searchBase":{"search":"","searchBase":""}},
        // "params":{},"route":{"path":"index.html"},"routeParams":{},"routes":[{"path":"index.html"}],"children":null,"data":[]}
    },
    onSubmit: function(e) { 
          // Prevent non-js form return
          e.preventDefault();
          // console.log('Search button has been pressed.'); //okay
          console.log('this.state.searchTerm: ' + this.state.searchTerm);  // Okay
          console.log('librivoxStore: ' + JSON.stringify(librivoxStore));  // nothing = {}
          // Dispatch action on stores.
          librivoxStore.dispatch(librivoxActions.getBookData('author/', this.state.searchTerm));  
          // let tempStore = librivoxStore.getState();
          // console.log('librivoxStore: ' + JSON.stringify(tempStore));  // nothing = {}
          // console.log('searchURL: ' + tempStore.searchURL.searchURL);
     },  
    searchTermChange: function(event) {
      // This just sets the input data associated with the text box. event is change on the Input box.
      this.setState({searchTerm: event.target.value});
      // console.log("this.state.searchTerm: " + this.state.searchTerm);
    },
    render: function () {
     // console.log('data' + JSON.stringify(this.props));
     // Note: Cannot pass data as object {} (will generate an error). Has to be array, because {} delimits variables in JSX.
     // We need to display a spinner if ajax is waiting on return data.
     // We need to display an error message if no there was an error.
     // Unfortunately, the Librivox API returns 401 if there is simply NO DATA (no such author) but the data has returned.
     // So we have to capture no data and prevent error messaging if we are only empty, but error if timed out.  Other
     // server errors will be 500 series.
      return ( 
        <div className="leftColumn">
          <h1 className="librivoxSearchHeader">Search Libri<b>VOX</b></h1>
          <div>
            <form onSubmit={this.onSubmit}>
               <label>Author Last Name: </label>
               <input type="text" placeholder="Search" onChange={this.searchTermChange} />
               <button type="submit">Search</button>
            </form>
           <SearchResultsDisplay data={this.props.data} searchTerm={this.state.searchTerm} />
          </div>
        </div>
      );
    }
});

// Write the components to their locations in the index.html DOM

// We really do not want to have two detached components.  They should be parent-child or parent-child-child.

// connect to Redux store

// NOTE: Redux examples do not show the use of the second ownProps optional parameter for mapStateToProps.  This may be where
// the MISSING passed parameters are getting dropped?  Do you HAVE to PASS THROUGH the components OTHER properties or they get
// erased/deleted?

var mapStateToProps = function(state, ownProps){
    // I don't GET how this function knows that stores bookData is already in state (is it?)
    // console.log("state in mapStateToProps: " + JSON.stringify(state)); // state
    // console.log("mapStateToProps args: " + arguments[0]); // okay
   console.log("data:state.bookData.data: " + state.bookData.data);
    // I would think that this should be PUTTING bookData into props
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    // The following should appear on this.props :
    return {
      data: state.bookData.data,  // this is an object
      currentBook: state.currentBook, // this is an object
      id: state.currentBook.id  // this is a string?
    }
};

// Maps the dispatch actions to the top level of props (makes available as top prop methods if needed).
var mapDispatchToProps = function(dispatch){
    // Maybe only need saveSearchURL?
    return {
        saveSearchURL: function(searchURL){ dispatch(librivoxActions.saveSearchURL(searchURL)); },
        getBookData: function(searchType, searchTerm){ dispatch(librivoxActions.getBookdata(searchType, searchTerm)); },
        saveBookData: function(data){ dispatch(librivoxActions.saveBookData(data)); },
        saveBookDataFetchError: function(err){ dispatch(librivoxActions.saveBookDataFetchError(err)); }
    }
};  

/* actions
export function saveSearchURL(searchURL)
export function getBookData (searchType = 'author/', searchTerm) 
export function saveBookData(data) 
export function saveBookDataFetchError(err) 
*/
// Does this "magically" pass the state of the App component?  No explantion is given in the docs.

// Connect everything up, using the same props.  This is to try to make everything work, since something
// is going wrong with the connections when Search is not connected?

var AppConnected = connect(mapStateToProps,mapDispatchToProps)(App);  // see connect() function in react-redux

// Can we get by with only the top component connected?

// var BookDataDisplayConnected = connect(mapStateToProps,mapDispatchToProps)(BookDataDisplay);

//var SearchConnected = connect(mapStateToProps,mapDispatchToProps)(Search);

// Router seems to have a problem trying to start up in a subdirectory.  It resolves "react_librivox_store/index.html" 
// rather than "/index.html" and hence gives a router error.  See below for configuring the baseName path to start in
// a subfolder.

// NOTE: Warning: [react-router] `Router` no longer defaults the history prop to hash history. Please use the `hashHistory` 
// singleton instead. http://tiny.cc/router-defaulthistory

// NOTE: Use the history dependency module contained inside of react-router rather than the full-blown
// npm history module, which does not even contain createHistory.  Using npm history will cause 'createHistory is
// not a function' error, since createHistory is not defined.
// console.log("typeof createHistory: " + typeof createHistory);  // typeof createHistory: undefined
// Dan Abramov says not to use createHistory in any case

// NOTE: If you implement hash history even once, you have to empty the history cache completely in order to 
// make sure that browserHistory works right again when it is reimplemented.

const history = useRouterHistory(createBrowserHistory)({
  basename: '/react_librivox_search/'
});


// To get a correctly nested app with right and left columns, I will probably have to refactor the current app2
// into a search component in a left column, with book list below it, then individual book display in the right
// column.

// What is the difference between component and handler (older React router)?
// react-router will not allow bookdatadisplay to be targeted to a specific div in the index page.
// It also reloads the entire app whenever a book route is used.  In other words, route "nesting" does not actually
// work as advertised (in docs).  Does bookdatadisplay need to be a CHILD of IndexRoute in order for properties to 
// be passed to it?

// book/id: error
//  Warning: [react-router] Location "book/53" did not match any routes
// http://jstest.dd:8083/react_librivox_search/book/bundle.js
// Line 22678
// Warning: [react-router] Location "book/140" did not match any routes
// IS this because of the missing first slash -- why ????  Both the route path and the link path have an initial slash, but
// why is it missing in the error message and in the buried code?
// Warning: [react-router] Location "book/53" did not match any routes -- no effect when first "/" is removed.
// parentheses make the :id parameter optional

ReactDOM.render(
  <Provider store={librivoxStore}>
    <Router history={history}>
      <Route path="index.html" component={AppConnected}>
        <IndexRoute component={Search}>
          <Route path="book/:id" component={BookDataDisplay}/>
        </IndexRoute>
      </Route>
    </Router >
  </Provider>, document.getElementById("appdiv"));
/*
ReactDOM.render(
  <Provider store={librivoxStore}>
    <Router history={history}>
       <Route path="/book/:id" component={BookDataDisplayConnected}/>
    </Router>
  </Provider>, document.getElementById("bookdata"));
*/
// Incorporate into main component, or will require a global object to connect them together?
// ReactDOM.render(<BookDataDisplay />, document.getElementById("searchdata"));  // "searchdata" isn't the best name -- try "bookdata"


/*
COPY OUT STUFF HERE TEMPORILY

*/