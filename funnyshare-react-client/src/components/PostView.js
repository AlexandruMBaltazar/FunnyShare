import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

class PostView extends Component {
  render() {
    const { post } = this.props;
    const { user, date } = post;
    const { username, displayName, image } = user;
    const relativeDate = format(date);
    const attachmentImageVisible =
      post.attachment && post.attachment.fileType.startsWith("image");

    return (
      <div className="card p-1">
        <div className="d-flex">
          <ProfileImageWithDefault
            className="rounded-circle m-1"
            width="32"
            height="32"
            image={image}
          />
          <div className="flex-fill m-auto ps-2">
            <Link to={`/${username}`} className="list-group-item-action">
              <h6 className="d-inline">
                {displayName}@{username}
              </h6>
            </Link>
            <span className="text-black-50"> - </span>
            <span className="text-black-50">{relativeDate}</span>
          </div>
        </div>
        <div className="ps-5">{post.content}</div>
        {attachmentImageVisible && (
          <div className="ps-5">
            <img
              className="img-fluid"
              src={`/images/attachments/${post.attachment.name}`}
              alt="attachment"
            />
          </div>
        )}
      </div>
    );
  }
}

export default PostView;
