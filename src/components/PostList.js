import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPostsAndUsers } from '../actions';
import UserHeader from './UserHeader';

class PostList extends Component {
  componentDidMount() {
    this.props.fetchPostsAndUsers();
  }

  renderList = () => {
    return this.props.posts.map(post => {
      return (
        <div
          className='list-group-item '
          key={post.id}
          style={{ backgroundColor: 'rgb(250, 250, 250)' }}
        >
          <div className='d-flex align-items-center'>
            <i className='fas fa-user-alt item'></i>

            <div className='text-left item pl-4'>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <UserHeader userId={post.userId} />
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return <div className='list-group mb-5'>{this.renderList()}</div>;
  }
}

const mapStateToProps = state => {
  return { posts: state.posts };
};

export default connect(mapStateToProps, { fetchPostsAndUsers })(PostList);
