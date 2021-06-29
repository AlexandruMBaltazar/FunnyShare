import React, { Component } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux /authActions";

export class UserSignupPage extends Component {
  state = {
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
    pendingApiCall: false,
    errors: {},
    passwordIsConfirmed: true,
  };

  onChangeDisplayName = (event) => {
    const value = event.target.value;
    let errors = { ...this.state.errors };
    delete errors.displayName;
    this.setState({ displayName: value, errors });
  };

  onChangeUsername = (event) => {
    const value = event.target.value;
    let errors = { ...this.state.errors };
    delete errors.username;
    this.setState({ username: value, errors });
  };

  onChangePassword = (event) => {
    const value = event.target.value;
    const passwordIsConfirmed = this.state.confirmPassword === value;

    const errors = { ...this.state.errors };
    delete errors.password;
    errors.confirmPassword = passwordIsConfirmed
      ? ""
      : "Does not match to password";

    this.setState({ passwordIsConfirmed, password: value, errors });
  };

  onChangeConfirmPassword = (event) => {
    const value = event.target.value;
    const passwordIsConfirmed = this.state.password === value;

    const errors = { ...this.state.errors };
    errors.confirmPassword = passwordIsConfirmed
      ? ""
      : "Does not match to password";

    this.setState({ passwordIsConfirmed, confirmPassword: value, errors });
  };

  onClick = () => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };

    this.setState({ pendingApiCall: true });

    //   this.setState({ pendingApiCall: false }, () =>
    //   this.props.history.push('/')
    // )

    this.props.actions
      .postSignup(user)
      .then((response) => {
        this.setState({ pendingApiCall: false }, () =>
          this.props.history.push("/")
        );
      })
      .catch((apiError) => {
        let errors = { ...this.state.errors };

        if (apiError.response.data && apiError.response.data.validationErrors) {
          errors = { ...apiError.response.data.validationErrors };
        }

        this.setState({ pendingApiCall: false, errors });
      });
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          <Input
            label="Display Name"
            type="text"
            name="displayName"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
            hasError={this.state.errors.displayName && true}
            error={this.state.errors.displayName}
          />
        </div>
        <div className="col-12 mb-3">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
            hasError={this.state.errors.username && true}
            error={this.state.errors.username}
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
            hasError={this.state.errors.password && true}
            error={this.state.errors.password}
          />
        </div>
        <div className="col-12 mb-3">
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={this.state.confirmPassword}
            onChange={this.onChangeConfirmPassword}
            hasError={this.state.errors.confirmPassword && true}
            error={this.state.errors.confirmPassword}
          />
        </div>
        <div className="text-center">
          <ButtonWithProgress
            onClick={this.onClick}
            disabled={
              this.state.pendingApiCall || !this.state.passwordIsConfirmed
            }
            pendingApiCall={this.state.pendingApiCall}
            text="Sign Up"
          ></ButtonWithProgress>
        </div>
      </div>
    );
  }
}

UserSignupPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
  history: {
    push: () => {},
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postSignup: (user) => dispatch(authActions.singupHandler(user)),
    },
  };
};

export default connect(null, mapDispatchToProps)(UserSignupPage);
