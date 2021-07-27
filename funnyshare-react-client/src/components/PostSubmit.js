import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";

class PostSubmit extends Component {
  state = {
    focused: false,
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onClickCancel = () => {
    this.setState({ focused: false });
  };

  render() {
    return (
      <div className="card d-flex flex-row p-1">
        <ProfileImageWithDefault
          className="rounded-circle m-1"
          width="32"
          height="32"
          image={this.props.loggedInUser.image}
        />

        <div className="flex-fill">
          <textarea
            className="form-control w-100"
            rows={this.state.focused ? 3 : 1}
            onFocus={this.onFocus}
          />

          {this.state.focused && (
            <div className="float-end mt-1">
              <button className="btn btn-success px-4">Post</button>
              <button
                className="btn btn-light ms-1"
                onClick={this.onClickCancel}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(PostSubmit);
