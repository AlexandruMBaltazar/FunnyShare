import React, { useState } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux /authActions";

export const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { value, name } = event.target;

    setForm((previousForm) => {
      return {
        ...previousForm,
        [name]: value,
      };
    });

    setErrors((previousErrors) => {
      return {
        ...previousErrors,
        [name]: undefined,
      };
    });
  };

  const onClick = () => {
    const user = {
      username: form.username,
      displayName: form.displayName,
      password: form.password,
    };

    setPendingApiCall(true);

    props.actions
      .postSignup(user)
      .then((response) => {
        setPendingApiCall(false);
        props.history.push("/");
      })
      .catch((apiError) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
          setErrors(apiError.response.data.validationErrors);
        }
        setPendingApiCall(false);
      });
  };

  let passwordConfirmError;
  const { password, confirmPassword } = form;

  if (password || confirmPassword) {
    passwordConfirmError =
      password === confirmPassword ? "" : "Does not match to password";
  }

  return (
    <div className="container">
      <h1 className="text-center">Sign Up</h1>
      <div className="col-12 mb-3">
        <Input
          label="Display Name"
          type="text"
          name="displayName"
          placeholder="Your display name"
          value={form.displayName}
          onChange={onChange}
          hasError={errors.displayName && true}
          error={errors.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Your username"
          value={form.username}
          onChange={onChange}
          hasError={errors.username && true}
          error={errors.username}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          value={form.password}
          onChange={onChange}
          hasError={errors.password && true}
          error={errors.password}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={onChange}
          hasError={passwordConfirmError && true}
          error={passwordConfirmError}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClick}
          disabled={pendingApiCall || passwordConfirmError ? true : false}
          pendingApiCall={pendingApiCall}
          text="Sign Up"
        ></ButtonWithProgress>
      </div>
    </div>
  );
};

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
