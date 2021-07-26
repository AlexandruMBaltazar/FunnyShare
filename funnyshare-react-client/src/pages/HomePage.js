import React, { Component } from "react";
import UserList from "../components/UserList";
import PostSubmit from "../components/PostSubmit";

class HomePage extends Component {
  render() {
    return (
      <div data-testid="homepage">
        <div className="row">
          <div className="col-8">
            <PostSubmit />
          </div>
          <div className="col-4">
            <UserList />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
