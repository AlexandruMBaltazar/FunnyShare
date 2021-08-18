import React from "react";
import { render } from "@testing-library/react";
import PostView from "./PostView";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux /authReducer";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4assword",
  isLoggedIn: true,
};

const postWithoutAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const postWithAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "image/png",
    name: "attached-image.png",
  },
};

const postWithPdfAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "application/pdf",
    name: "attached.pdf",
  },
};

const setup = (post = postWithoutAttachment, state = loggedInStateUser1) => {
  const store = createStore(authReducer, state);
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);

  post.date = date;

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PostView post={post} />
      </MemoryRouter>
    </Provider>
  );
};

describe("PostView", () => {
  describe("Layout", () => {
    it("displays post content", () => {
      const { queryByText } = setup();
      expect(queryByText("This is the first post")).toBeInTheDocument();
    });

    it("displays users image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });

    it("displays displayName@user", () => {
      const { queryByText } = setup();
      expect(queryByText("display1@user1")).toBeInTheDocument();
    });

    it("displays relative time", () => {
      const { queryByText } = setup();
      expect(queryByText("1 minute ago")).toBeInTheDocument();
    });

    it("has link to user page", () => {
      const { container } = setup();
      const anchor = container.querySelector("a");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });

    it("displays file attachment image", () => {
      const { container } = setup(postWithAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(2);
    });

    it("does not displays file attachment when attachment type is not image", () => {
      const { container } = setup(postWithPdfAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(1);
    });

    it("sets the attachment path as source for file attachment image", () => {
      const { container } = setup(postWithAttachment);
      const images = container.querySelectorAll("img");
      const attachmentImage = images[1];
      expect(attachmentImage.src).toContain(
        "/images/attachments/" + postWithAttachment.attachment.name
      );
    });
  });
});
