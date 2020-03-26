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

5. Create action creator file: src/action/index.js
   - we will call our action creator for fetching posts, fethPosts:

```
            export const fetchPosts = () => {
                return {
                    type: 'FETCH_POSTS'
                };
            };

```

6. wire up the action creator to our PostList component:
   - import {connect} from react-redux
   - also import our fetchPosts action creator from actions folder.
   - at export default, we can call the connect() function. As we don't yet have mapStateToPRops we pass it null.
   - pass in our action creator as 2nd arg to connect
   - create componentDidMount to call this.props.fetchPosts(), the action creator

```
        export default connect(null, { fetchPosts })(PostList);

        (above fetchPosts being shortened with ES2015 from
        {fetchPosts: fetchPosts})
```

7. preconfigure axios with src/apis/jsonPlaceholder.js and endpoint baseURL: 'https://jsonplaceholder.typicode.com'
   - import this into actions/index.js so it's accessible to action creators.
