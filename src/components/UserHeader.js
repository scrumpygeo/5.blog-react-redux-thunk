import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserHeader extends Component {
  render() {
    // no longer has access to original props but to this.props.user, courtesy mapStateToProps below
    const { user } = this.props;

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

const mapStateToProps = (state, ownProps) => {
  return { user: state.users.find(user => user.id === ownProps.userId) };
};

export default connect(mapStateToProps)(UserHeader);
