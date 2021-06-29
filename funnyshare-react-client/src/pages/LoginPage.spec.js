import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  describe("Layout", () => {
    it("has header of Login", () => {
      const { container } = render(<LoginPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Login");
    });
    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has input for password", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });
    it("has login button", () => {
      const { container } = render(<LoginPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };

    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };

    let usernameInput, passwordInput, button;

    const setUpForSubmit = (props) => {
      const rendered = render(<LoginPage {...props} />);

      const { container, queryByPlaceholderText } = rendered;

      usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("some-username"));
      passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      button = container.querySelector("button");

      return rendered;
    };

    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("some-username"));
      expect(usernameInput).toHaveValue("some-username");
    });

    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });

    it("calls postLogin when values are provided in props and input fields have value", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      setUpForSubmit({ actions });

      fireEvent.click(button);

      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props", () => {
      setUpForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("it calls postLogin with credentials in body", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      setUpForSubmit({ actions });
      fireEvent.click(button);

      const expectedUser = {
        username: "some-username",
        password: "P4ssword",
      };

      expect(actions.postLogin).toHaveBeenCalledWith(expectedUser);
    });

    it("enables the button when username and password are not empty", () => {
      setUpForSubmit();
      expect(button).not.toBeDisabled();
    });

    it("disables the button when username or password is empty", () => {
      setUpForSubmit();
      fireEvent.change(usernameInput, changeEvent(""));
      expect(button).toBeDisabled();
    });

    it("displays alert when login fails", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });

      fireEvent.click(button);

      await waitFor(() => {
        expect(queryByText("Login failed")).toBeInTheDocument();
      });
    });

    it("clears login alert when user changes username field", () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });

      fireEvent.click(button);

      waitFor(() => {
        expect(queryByText("Login failed")).toBeInTheDocument();
      });
      fireEvent.change(usernameInput, changeEvent("some-username"));

      const alert = queryByText("Login failed");

      expect(alert).not.toBeInTheDocument();
    });

    it("clears login alert when user changes password field", () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });

      fireEvent.click(button);

      waitFor(() => {
        expect(queryByText("Login failed")).toBeInTheDocument();
      });
      fireEvent.change(passwordInput, changeEvent("some-username"));

      const alert = queryByText("Login failed");

      expect(alert).not.toBeInTheDocument();
    });

    it("does not allow user to click login button when there is an outgoing api call", () => {
      const actions = {
        postLogin: mockAsyncDelayed(),
      };

      setUpForSubmit({ actions });
      fireEvent.click(button);

      fireEvent.click(button);

      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it("dispaly spinner when there is an outgoing api call", () => {
      const actions = {
        postLogin: mockAsyncDelayed(),
      };

      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });

    it("hides a spinner when the api call finishes successfully ", async () => {
      const actions = {
        postLogin: mockAsyncDelayed(),
      };

      const { queryByText } = setUpForSubmit({ actions });

      fireEvent.click(button);

      await waitFor(() => {
        expect(queryByText("Loading...")).not.toBeInTheDocument();
      });
    });

    it("hides a spinner when the api call finishes with error ", async () => {
      const actions = {
        postLogin: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });

      fireEvent.click(button);

      await waitFor(() => {
        expect(queryByText("Loading...")).not.toBeInTheDocument();
      });
    });

    it("redirects to HomePage after succesful login ", async () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      const history = {
        push: jest.fn(),
      };

      setUpForSubmit({ actions, history });

      fireEvent.click(button);

      await waitFor(() => {
        expect(history.push).toHaveBeenCalledWith("/");
      });
    });
  });
});

console.error = () => {};
