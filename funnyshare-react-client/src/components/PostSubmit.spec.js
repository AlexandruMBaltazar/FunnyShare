import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import PostSubmit from "./PostSubmit";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux /authReducer";
import * as apiCalls from "../api/apiCalls";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4assword",
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <PostSubmit />
    </Provider>
  );
};

describe("PostSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });

    it("has image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });

    it("dispalys textarea 1 line", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea.rows).toBe(1);
    });

    it("displays user image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/" + defaultState.image);
    });
  });

  describe("Interactions", () => {
    it("displays 3 rows when focused to textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      expect(textArea.rows).toBe(3);
    });

    it("displays post button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const postButton = queryByText("Post");
      expect(postButton).toBeInTheDocument();
    });

    it("displays cancel button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });

    it("does not display post button when not focused to textarea", () => {
      const { container, queryByText } = setup();
      const postButton = queryByText("Post");
      expect(postButton).not.toBeInTheDocument();
    });

    it("does not display cancel button when not focused to textarea", () => {
      const { container, queryByText } = setup();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });

    it("it returns back to unfocused state after clicking cancel", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("calls postPost with post request object when clicking Post", () => {
      const { queryByText, container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      expect(apiCalls.postPost).toHaveBeenCalledWith({
        content: "Test post content",
      });
    });

    it("returns back to unfocused state after successful postPost action", async () => {
      const { queryByText, container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(apiCalls.postPost).toHaveBeenCalledWith({
          content: "Test post content",
        });
      });

      expect(queryByText("Post")).not.toBeInTheDocument();
    });

    it("clear content after successful postPost action", async () => {
      const { queryByText, container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(apiCalls.postPost).toHaveBeenCalledWith({
          content: "Test post content",
        });
      });

      expect(queryByText("Test post content")).not.toBeInTheDocument();
    });

    it("clear content after clicking on cancel", async () => {
      const { queryByText, container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);

      expect(queryByText("Test post content")).not.toBeInTheDocument();
    });
  });
});
