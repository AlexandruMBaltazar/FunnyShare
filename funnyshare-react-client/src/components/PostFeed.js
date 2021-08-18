import React, { Component } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";
import PostView from "./PostView";
import Modal from "./Modal";

class PostFeed extends Component {
  state = {
    page: {
      content: [],
    },
    isLoadingPosts: false,
    newPostCount: 0,
    isLoadingOldPosts: false,
    isLoadingNewPosts: false,
    isDeletingPost: false,
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
    this.setState({ isLoadingOldPosts: true });
    apiCalls
      .loadOldPosts(postAtBottom.id, this.props.user)
      .then((response) => {
        const page = { ...this.state.page };
        page.content = [...page.content, ...response.data.content];
        page.last = response.data.last;

        this.setState({ page, isLoadingOldPosts: false });
      })
      .catch((error) => {
        this.setState({ isLoadingOldPosts: false });
      });
  };

  onClickLoadNew = () => {
    const posts = this.state.page.content;
    let topPostId = 0;

    if (posts.length > 0) {
      topPostId = posts[0].id;
    }
    this.setState({ isLoadingNewPosts: true });
    apiCalls
      .loadNewPosts(topPostId, this.props.user)
      .then((response) => {
        const page = { ...this.state.page };
        page.content = [...response.data, ...page.content];
        this.setState({ page, newPostCount: 0, isLoadingNewPosts: false });
      })
      .catch((error) => {
        this.setState({ isLoadingNewPosts: false });
      });
  };

  onClickDeletePost = (post) => {
    this.setState({ postToBeDeleted: post });
  };

  onClickModalCancel = () => {
    this.setState({ postToBeDeleted: undefined });
  };

  onClickModalOk = () => {
    this.setState({ isDeletingPost: true });
    apiCalls.deletePost(this.state.postToBeDeleted.id).then((response) => {
      const page = { ...this.state.page };
      page.content = page.content.filter(
        (post) => post.id !== this.state.postToBeDeleted.id
      );

      this.setState({
        postToBeDeleted: undefined,
        page,
        isDeletingPost: false,
      });
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

    const newPostCountMessage =
      this.state.newPostCount === 1
        ? "There is 1 new post"
        : `There are ${this.state.newPostCount} new posts`;

    return (
      <div>
        {this.state.newPostCount > 0 && (
          <div
            className="card card-header text-center"
            style={{
              cursor: this.state.isLoadingNewPosts ? "not-allowed" : "pointer",
            }}
            onClick={!this.state.isLoadingNewPosts && this.onClickLoadNew}
          >
            {this.state.isLoadingNewPosts ? <Spinner /> : newPostCountMessage}
          </div>
        )}
        {this.state.page.content.map((post) => {
          return (
            <PostView
              key={post.id}
              post={post}
              onClickDelete={() => this.onClickDeletePost(post)}
            />
          );
        })}
        {this.state.page.last === false && (
          <div
            className="card card-header text-center"
            style={{
              cursor: this.state.isLoadingOldPosts ? "not-allowed" : "pointer",
            }}
            onClick={!this.state.isLoadingOldPosts && this.onClickLoadMore}
          >
            {this.state.isLoadingOldPosts ? <Spinner /> : "Load More"}
          </div>
        )}
        <Modal
          visible={this.state.postToBeDeleted && true}
          onClickCancel={this.onClickModalCancel}
          body={
            this.state.postToBeDeleted &&
            `Are you sure to delete '${this.state.postToBeDeleted.content}'?`
          }
          title="Delete Post!"
          okButton="Delete"
          onClickOk={this.onClickModalOk}
          pendingApiCall={this.state.isDeletingPost}
        />
      </div>
    );
  }
}

export default PostFeed;
