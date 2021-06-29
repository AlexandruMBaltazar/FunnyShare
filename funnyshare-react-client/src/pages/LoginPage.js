import React, { Component } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux /authActions";

export class LoginPage extends Component {
  state = {
    username: "",
    password: "",
    apiError: undefined,
    pendingApiCall: false,
  };

  onChangeUsername = (event) => {
    const value = event.target.value;
    this.setState({ username: value, apiError: undefined });
  };

  onChangePassword = (event) => {
    const value = event.target.value;
    this.setState({ password: value, apiError: undefined });
  };

  onClickLogin = () => {
    let user = {
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({ pendingApiCall: true });

    this.props.actions
      .postLogin(user)
      .then((response) => {
        this.setState({ pendingApiCall: false }, () => {
          this.props.history.push("/");
        });
      })
      .catch((error) => {
        this.setState({ pendingApiCall: false });
        if (error.response) {
          this.setState({ apiError: error.response.data.message });
        }
      });
  };

  render() {
    let disableSubmit =
      this.state.username && this.state.password ? false : true;

    return (
      <div className="container">
        <h1 className="text-center">Login</h1>
        <div className="col-12 mb-3">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Your password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>

        {this.state.apiError && (
          <div className="col-12 mb-3">
            <div className="alert alert-danger">{this.state.apiError}</div>
          </div>
        )}

        <div className="text-center">
          <ButtonWithProgress
            onClick={this.onClickLogin}
            disabled={disableSubmit || this.state.pendingApiCall}
            text="Login"
            pendingApiCall={this.state.pendingApiCall}
          ></ButtonWithProgress>
        </div>
      </div>
    );
  }
}

LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({})),
  },
  dispatch: () => {},
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postLogin: (user) => dispatch(authActions.loginHandler(user)),
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginPage);
