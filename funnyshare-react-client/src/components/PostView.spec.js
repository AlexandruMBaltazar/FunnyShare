import React from "react";
import { render } from "@testing-library/react";
import PostView from "./PostView";

const setup = () => {
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);

  const post = {
    id: 10,
    content: "This is the first post",
    date: date,
    user: {
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
    },
  };

  return render(<PostView post={post} />);
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
  });
});
