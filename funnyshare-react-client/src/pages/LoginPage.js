import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux /authActions";

export const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState();
  const [pendingApiCall, setPendingApiCall] = useState(false);

  useEffect(() => {
    setApiError();
  }, [username, password]);

  const onClickLogin = () => {
    let user = {
      username,
      password,
    };

    setPendingApiCall(true);

    props.actions
      .postLogin(user)
      .then((response) => {
        setPendingApiCall(false);
        props.history.push("/");
      })
      .catch((error) => {
        if (error.response) {
          setPendingApiCall(false);
          setApiError(error.response.data.message);
        }
      });
  };

  let disableSubmit = username && password ? false : true;

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      </div>

      <div className="col-12 mb-3">
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      {apiError && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">{apiError}</div>
        </div>
      )}

      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickLogin}
          disabled={disableSubmit || pendingApiCall}
          text="Login"
          pendingApiCall={pendingApiCall}
        ></ButtonWithProgress>
      </div>
    </div>
  );
};

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
