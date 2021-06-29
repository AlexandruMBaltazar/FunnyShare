import * as apiCalls from "../api/apiCalls";

export const loginSuccess = (loginUserData) => {
  return {
    type: "login-success",
    payload: loginUserData,
  };
};

export const loginHandler = (credentials) => (dispatch) => {
  return apiCalls.login(credentials).then((response) => {
    dispatch(
      loginSuccess({
        ...response.data,
        password: credentials.password,
      })
    );
    return response;
  });
};

export const singupHandler = (user) => (dispatch) => {
  return apiCalls.signup(user).then((response) => {
    return dispatch(loginHandler(user));
  });
};
