import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "../redux /configureStore";
import axios from "axios";
import * as apiCalls from "../api/apiCalls";

beforeEach(() => {
  apiCalls.loadPosts = jest.fn().mockResolvedValue({
    data: {
      content: [],
      number: 0,
      size: 3,
    },
  });

  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});

const setup = (path) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const changeEvent = (content) => {
  return {
    target: {
      value: content,
    },
  };
};

const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: "user2",
    displayName: "display2",
    image: "profile2.png",
  },
};

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "funnyshare-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    })
  );
};

describe("App", () => {
  it("dispalys homepage when url is /", () => {
    const { queryByTestId } = setup("/");
    expect(queryByTestId("homepage")).toBeInTheDocument();
  });

  it("dispalys LoginPage when url is /login", () => {
    const { container } = setup("/login");
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });

  it("dispalys only LoginPage when url is /login", () => {
    const { queryByTestId } = setup("/login");
    expect(queryByTestId("homepage")).not.toBeInTheDocument();
  });

  it("dispalys UserSignupPage when url is /signup", () => {
    const { container } = setup("/signup");
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Sign Up");
  });

  it("dispalys UserPage when url is other than /, /login, /signup", () => {
    const { queryByTestId } = setup("/user1");
    expect(queryByTestId("userpage")).toBeInTheDocument();
  });

  it("dispalys TopBar when url is /", () => {
    const { container } = setup("/");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  it("dispalys TopBar when url is /login", () => {
    const { container } = setup("/login");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  it("dispalys TopBar when url is /singup", () => {
    const { container } = setup("/signup");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  it("dispalys TopBar when url is /user1", () => {
    const { container } = setup("/user1");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  it("shows the UserSingupPage when clicking singup", () => {
    const { queryByText, container } = setup("/");
    const signupLink = queryByText("Sign Up");
    fireEvent.click(signupLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Sign Up");
  });

  it("shows the LoginPage when clicking login", () => {
    const { queryByText, container } = setup("/");
    const loginLink = queryByText("Login");
    fireEvent.click(loginLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });

  it("shows the HomePage when clicking the logo", () => {
    const { queryByTestId, container } = setup("/");
    const logo = container.querySelector("img");
    fireEvent.click(logo);
    expect(queryByTestId("homepage")).toBeInTheDocument();
  });

  it("dispalys My Profile on TopBar after login succsess", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByText("My Profile")).toBeInTheDocument();
    });
  });

  it("displays My Profile on TopBar after signup success", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/signup");

    const displayNameInput = queryByPlaceholderText("Your display name");
    const usernameInput = queryByPlaceholderText("Your username");
    const passwordInput = queryByPlaceholderText("Your password");
    const passwordConfirmationInput = queryByPlaceholderText(
      "Confirm your password"
    );

    fireEvent.change(displayNameInput, changeEvent("display1"));
    fireEvent.change(usernameInput, changeEvent("user1"));
    fireEvent.change(passwordInput, changeEvent("P4assword"));
    fireEvent.change(passwordConfirmationInput, changeEvent("P4assword"));

    const button = container.querySelector("button");

    axios.post = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: "User saved",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      });

    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByText("My Profile")).toBeInTheDocument();
    });
  });

  it("saves logged in user data to localStorage after login succsess", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByText("My Profile")).toBeInTheDocument();

      const dataInStorage = JSON.parse(localStorage.getItem("funnyshare-auth"));
      expect(dataInStorage).toEqual({
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
        password: "P4ssword",
        isLoggedIn: true,
      });
    });
  });

  it("displays logged in topBar when storage has logged in user data", () => {
    setUserOneLoggedInStorage();

    const { queryByText } = setup("/");
    const myProfileLink = queryByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });

  it("sets axios authorization with base64 user credentials after login succsess", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(queryByText("My Profile")).toBeInTheDocument();

      const axiosAuthorization = axios.defaults.headers.common["Authorization"];
      const encoded = btoa("user1:P4ssword");
      const expectedAuthorization = `Basic ${encoded}`;

      expect(axiosAuthorization).toBe(expectedAuthorization);
    });
  });

  it("sets axios authorization with base64 user credentials when storage has logged in user data", () => {
    setUserOneLoggedInStorage();

    setup("/");

    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;

    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("removes axios authorization header when user logout", () => {
    setUserOneLoggedInStorage();

    const { queryByText } = setup("/");

    fireEvent.click(queryByText("Logout"));

    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    expect(axiosAuthorization).toBeFalsy();
  });

  it("updated user page after clicking my profile when another user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockResolvedValueOnce(mockSuccessGetUser2)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();

    const { queryByText } = setup("/user2");

    await waitFor(() => {
      expect(queryByText("display2@user2")).toBeInTheDocument();
    });

    const myProfileLink = queryByText("My Profile");
    fireEvent.click(myProfileLink);

    await waitFor(() => {
      expect(queryByText("display1@user1")).toBeInTheDocument();
    });
  });
});

console.error = () => {};
