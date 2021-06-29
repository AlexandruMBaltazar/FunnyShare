import { createStore, applyMiddleware, compose } from "redux";
import authReducer from "./authReducer";
import logger from "redux-logger";
import thunk from "redux-thunk";
import * as apiCalls from "../api/apiCalls";

const configureStore = (addLogger = true) => {
  let localStorageData = localStorage.getItem("funnyshare-auth");

  let persistedState = {
    id: 0,
    username: "",
    displayName: "",
    image: "",
    password: "",
    isLoggedIn: false,
  };

  if (localStorageData) {
    try {
      persistedState = JSON.parse(localStorageData);
      apiCalls.setAuthorizationHeader(persistedState);
    } catch (error) {}
  }

  const middleware = addLogger
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    authReducer,
    persistedState,
    composeEnhancers(middleware)
  );

  // const store = createStore(authReducer, middleware);
  store.subscribe(() => {
    localStorage.setItem("funnyshare-auth", JSON.stringify(store.getState()));
    apiCalls.setAuthorizationHeader(store.getState());
  });

  return store;
};

export default configureStore;
