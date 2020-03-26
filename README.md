## React Redux Thunk Blog using jsonPlaceholder API

App grabs blog data from API then makes a 2nd request to grab user data relating to the blog while minimizing number of requests.

Setup:

- using Bootstrap and font awesome for styling.

- npm i --save redux react-redux axios redux-thunk lodash

**Steps**

1. initial setup in index.js:

   - in addition to standard imports of react and react-dom, we need to import Provider from react-redux and createStore from redux as well as reducers from a reducer we will shortly write.
   - wrap App in Provider and assign store prop to createStore(reducers)

2. create components/App.js and import React; create it as functional component

3. create src/reducers/index.js file as a dummy reducer file

   - import { combineReducers } from redux and export dummy value so it doesn't give errors complaining about need for a valid reducer:

```
        import { combineReducers } from 'redux';

        export default combineReducers({
        replaceThis: () => 'Hello'
        });


```

4. create components/PostList.js as a class based component.
   - import it into App
