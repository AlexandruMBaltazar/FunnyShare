import React, { Component } from "react";
import * as apiCalls from "../api/apiCalls";

class PostFeed extends Component {
  componentDidMount() {
    apiCalls.loadPosts(this.props.user);
  }

  render() {
    return (
      <div className="card card-header text-center">There are no posts</div>
    );
  }
}

export default PostFeed;
