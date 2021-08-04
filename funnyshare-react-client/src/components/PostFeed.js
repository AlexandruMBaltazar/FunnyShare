import React, { Component } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";

class PostFeed extends Component {
  state = {
    page: {
      content: [],
    },
    isLoadingPosts: false,
  };

  componentDidMount() {
    this.setState({ isLoadingPosts: true });
    apiCalls.loadPosts(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingPosts: false });
    });
  }

  render() {
    if (this.state.isLoadingPosts) {
      return <Spinner />;
    }

    if (this.state.page.content.length === 0) {
      return (
        <div className="card card-header text-center">There are no posts</div>
      );
    }

    return (
      <div>
        {this.state.page.content.map((post) => {
          return <span key={post.id}> {post.content} </span>;
        })}
      </div>
    );
  }
}

export default PostFeed;
