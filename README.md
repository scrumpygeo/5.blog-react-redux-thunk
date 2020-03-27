## React Redux Thunk Blog using jsonPlaceholder API

This app demonstrates the basic use of React Redux with Redux-Thunk to access an API.
It grabs dummy blog data from API to store a list of posts then makes a 2nd request to grab user data relating to each blog post while minimizing number of API requests.

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

8. in index.js import thunk from 'redux-thunk' and applyMiddleware from redux

   - wire up redux thunk by modifying Provider store prop assignment by creating store variable separately:
   - const store = createStore(reducers, applyMiddleware(thunk));
   - in Provider, stote={store} , ie assign to store prop.

9. Change action creator to reflect use of thunk middlware.
   - define a function, fetchPosts, that returns a function:

```
    import jsonPlaceholder from '../apis/jsonPlaceholder';

    export const fetchPosts = () => async dispatch => {
        const response = await jsonPlaceholder.get('/posts');

        dispatch({ type: 'FETCH_POSTS', payload: response.data });
    };
```

10. Now focus on reducers: a separate file for each reducer. Create reducers/postsReducer.js
    with a stub:

```
            export default () => {
            return 123;
            };

```

- import file into reducers/index.js
- connect it to combineReducers with key of posts:

```
         export default combineReducers({
         posts: postsReducer
         });

```

- the postsReducer is there to maintain a list of posts form the api.
- as this state is in the form of an array, make sure state has default of empty array so that there is no undefined value the very first time it is called.
- check for action type and return payload if appropriate.

```
            export default (state = [], action) => {
            switch (action.type) {
               case 'FETCH_POSTS':
                  return action.payload;
               default:
                  return state;
            }
            };
```

11. Now we've defined the reducer, we go to the PostList component to get the list of posts in it.

- this needs mapStateToProps function, which takes state from redux store and is passed into connect
- state will have property called posts because in reducer index we defined posts: postsReducer, so posts holds all the data the reducer has returned.

```
   PostList tail end:

         const mapStateToProps = state => {
         return { posts: state.posts };
         };

         export default connect(mapStateToProps, { fetchPosts })(PostList);
```

12. PostList: write helper function outside render method to handle logic and create JSX. This includes some css styling.

13. Get blog post author via second request to API at /users endpoint.

    - create action creator fetchUser
    - this makes api request to /users/{id}
    - it then dispatches an action of type 'FETCH_USER' with data in payload.
    - we also create a usersReducer which will hold a list of all users we have fetched.

i. create action creator in actions/index called fetchUser(id) that takes in id of user we will fetch

ii. create UserHeader class-based component to hold user name and import into PostList component with props: `<UserHeader userId={post.userId} />`

iii. in UserHeader ensure we call action creator to fetch correct user.
= import connect function & action creator (fetchUser) and use connect function to wire it up.

- as we don't yet have mapStateToProps, wire connect up this way:
  `export default connect(null, { fetchUser })(UserHeader);`

- to make sure we fetch the correct user every time component renders, add componentDidMount to call action creator:

```
         componentDidMount() {
            this.props.fetchUser(this.props.userId);
         }
```

iv. create the reducer to catch the above action: usersReducer:

```
         export default (state = [], action) => {
            switch (action.type) {
               case 'FETCH_USER':
                  return [...state, action.payload];
               default:
                  return state;
            }
         };

   and in reducers/index.js:

         export default combineReducers({
            posts: postsReducer,
            users: usersReducer
         });


```

v. UserHeader now needs access to redux level state, which requires mapStateToProps:

```
         const mapStateToProps = state => {
         return { users: state.users };
         };

   - this gives us access to all users in our list, so we have to loop thru and find the one we want in render() with:

       const user = this.props.users.find(user => user.id === this.props.userId);

   NB first time component renders to screen array will be empty, however the user we are interested in won't be available anyway. So after above add:
            if (!user) {
               return null;
            }

   And make sure mapStateToProps is called in connect:

      export default connect(mapStateToProps, { fetchUser })(UserHeader);
```

14. Refactor UserHeader.

- component is passed a collection of props - the entire list of users - when it's purpose is to show just 1 user. Ideally we want to pass it just 1 user. With mapStateToProps you can also do pre-calculations on values coming into props.
- relocate the logic in render finding our user into mapState to props. This increases reusability (in fact some engineers relocate mapStateToProps and connect function to a separate file )
- problem is that prop is only available inside the component, not outside where mapStateToProps is.
- However mapStateToProps is also called with a 2nd argument, ownProps, which is a reference to the props that are about to be passed to the component. So we can reference it for precalculation steps.

before:

```
         render() {
            const user = this.props.users.find(user => user.id === this.props.userId);
            if (!user) {
               return null;
            }
            return <div><em>{user.name}</em></div>;
            }
         }


         const mapStateToProps = state => {
         return { users: state.users };
         };

```

after:

```

               render() {
                  const { user } = this.props;    <---NB  props only contains user (singular)

                  if (!user) {
                     return null;
                  }
                  return (
                     <div>
                        <em>{user.name}</em>
                     </div>
                  );
                 }
               }

   Modify props before entry into UserHeader component via ownProps:

            const mapStateToProps = (state, ownProps) => {
            return { user: state.users.find(user => user.id === ownProps.userId) };
            };

```

15. Application currenly works but makes too many repeat requests for same user.

- one way to resolve this involves memoization, a function from lodash (npm i --save lodash)
- the other way I prefer still uses lodash but involves action creators within action creators:

  - create fetchPostsAndActionCreators action creatore which does all this:
    - calls fetchPosts
    - gets list of posts
    - finds unique userIds from the posts using uniq method from lodash
    - iterates over unique ids
    - calls fetchUser with each userId.
    - all our components will now call only fetchPostsAndUsers directly, not the other 2.
    - since fetchPostsAndUsers calls the other 2, it must dispatch the result via thunk with the dispatch method.
    - ie when u call an action creator from another action creator u must ensure u dispatch the result of calling the action creator. eg dispatch(fetchPosts())

  i. in actions/index, create fetchPostsAndUsers action creator
  ii. within it call fetchPosts and dispatch it to thunk: dispatch(fetchPosts())
  iii. get list of posts. So u must wait till dispatch(fetchPosts()) has completed.
  So prefix with await, ie `await dispatch(fetchPosts())`

  iv. connect up the new action creator with PostList like so:

      * import fetchPostsAndUsers into PostList component.
      * in componentDidMount replace call to fetchPosts with this.props.fetchPostsAndUsers();
      * at bottom hook up action creator to connect function: `export default connect(mapStateToProps, { fetchPostsAndUsers })(PostList);`

  v. give fetchPostsAndUsers access to state via getState parameter. So now we have access to all the posts in state via getState().posts. We can iterate thru this to look for unique ids.

  - this uses lodash library so `import _ from 'lodash';`
  - we use lodash's version of the map function :
  - this maps thru all the posts and pulls off the id property: `_.map(getState().posts, 'userId')` - gives us an array of all user ids.
  - to get unique user ids, use lodash uniqu method: `_.uniq(_.map(getState().posts, 'userid'))`
  - we now have an array with unique user ids.

  vi. iterate thru our list of unique ids and for each one call our fetchUser action creator and dispatch the result of it. We don't need an await this time because we don't care about waiting for each user to be fetched. There is no other logic to do after we fetch those users.
  (also the async await syntax doesn't work with the forEach statement)

```
   fetchPostsAndUsers:

      export const fetchPostsAndUsers = () => async (dispatch, getState) => {
      await dispatch(fetchPosts());
      const userIds = _.uniq(_.map(getState().posts, 'userId'));
      userIds.forEach(id => dispatch(fetchUser(id)));
      };


```

vii. In UserHeader, the componentDidMount is still there, calling fetchUser to get its own data so remove componentDidMount completely. We can also remove fetchUser references from this file, being the import and in the connect statement at bottom

Number of API requests can be checked in chrome tools looking at network data with xhr tag selected.
