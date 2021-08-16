import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import Input from "./Input";

class PostSubmit extends Component {
  state = {
    focused: false,
    content: undefined,
    pendingApiCall: false,
    errors: {},
    file: undefined,
    image: undefined,
  };

  onChangeContent = (event) => {
    const value = event.target.value;
    this.setState({ content: value, errors: {} });
  };

  onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file,
      });
    };

    reader.readAsDataURL(file);
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onClickCancel = () => {
    this.setState({
      focused: false,
      content: "",
      errors: {},
      file: undefined,
      image: undefined,
    });
  };

  onClickPost = () => {
    const body = {
      content: this.state.content,
    };

    this.setState({ pendingApiCall: true });

    apiCalls
      .postPost(body)
      .then((response) => {
        this.setState({
          focused: false,
          content: "",
          pendingApiCall: false,
        });
      })
      .catch((error) => {
        let errors = {};
        if (error.response.data && error.response.data.validationErrors) {
          errors = error.response.data.validationErrors;
        }
        this.setState({ pendingApiCall: false, errors });
      });
  };

  render() {
    let textAreaClassName = "form-control w-100";
    if (this.state.errors.content) {
      textAreaClassName += " is-invalid";
    }

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
            className={textAreaClassName}
            rows={this.state.focused ? 3 : 1}
            onFocus={this.onFocus}
            value={this.state.content}
            onChange={this.onChangeContent}
          />

          {this.state.errors.content && (
            <span className="invalid-feedback">
              {this.state.errors.content}
            </span>
          )}

          {this.state.focused && (
            <div>
              <div className="pt-1">
                <Input type="file" onChange={this.onFileSelect} />
                {this.state.image && (
                  <img
                    className="mt-1 img-thumbnail"
                    src={this.state.image}
                    alt="upload"
                    width="128"
                    height="64"
                  />
                )}
              </div>
              <div className="float-end mt-1">
                <ButtonWithProgress
                  className="btn btn-success px-4"
                  onClick={this.onClickPost}
                  disabled={this.state.pendingApiCall}
                  pendingApiCall={this.state.pendingApiCall}
                  text="Post"
                />

                <button
                  className="btn btn-light ms-1"
                  onClick={this.onClickCancel}
                  disabled={this.state.pendingApiCall}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
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
