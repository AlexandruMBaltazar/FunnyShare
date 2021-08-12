import React, { Component } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";
import PostView from "./PostView";

class PostFeed extends Component {
  state = {
    page: {
      content: [],
    },
    isLoadingPosts: false,
    newPostCount: 0,
  };

  componentDidMount() {
    this.setState({ isLoadingPosts: true });
    apiCalls.loadPosts(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingPosts: false }, () => {
        this.counter = setInterval(this.checkCount, 3000);
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  checkCount = () => {
    const posts = this.state.page.content;
    let topPostId = 0;

    if (posts.length > 0) {
      topPostId = posts[0].id;
    }

    apiCalls.loadNewPostsCount(topPostId, this.props.user).then((response) => {
      this.setState({ newPostCount: response.data.count });
    });
  };

  onClickLoadMore = () => {
    const posts = this.state.page.content;
    if (posts.length === 0) {
      return;
    }

    const postAtBottom = posts[posts.length - 1];

    apiCalls.loadOldPosts(postAtBottom.id, this.props.user).then((response) => {
      const page = { ...this.state.page };
      page.content = [...page.content, ...response.data.content];
      page.last = response.data.last;

      this.setState({ page });
    });
  };

  onClickLoadNew = () => {
    const posts = this.state.page.content;
    let topPostId = 0;

    if (posts.length > 0) {
      topPostId = posts[0].id;
    }

    apiCalls.loadNewPosts(topPostId, this.props.user).then((response) => {
      const page = { ...this.state.page };
      page.content = [...response.data, ...page.content];
      this.setState({ page, newPostCount: 0 });
    });
  };

  render() {
    if (this.state.isLoadingPosts) {
      return <Spinner />;
    }

    if (this.state.page.content.length === 0 && this.state.newPostCount === 0) {
      return (
        <div className="card card-header text-center">There are no posts</div>
      );
    }

    return (
      <div>
        {this.state.newPostCount > 0 && (
          <div
            className="card card-header text-center"
            style={{ cursor: "pointer" }}
            onClick={this.onClickLoadNew}
          >
            {this.state.newPostCount === 1
              ? "There is 1 new post"
              : `There are ${this.state.newPostCount} new posts`}
          </div>
        )}
        {this.state.page.content.map((post) => {
          return <PostView key={post.id} post={post} />;
        })}
        {this.state.page.last === false && (
          <div
            className="card card-header text-center"
            style={{ cursor: "pointer" }}
            onClick={this.onClickLoadMore}
          >
            Load More
          </div>
        )}
      </div>
    );
  }
}

export default PostFeed;
