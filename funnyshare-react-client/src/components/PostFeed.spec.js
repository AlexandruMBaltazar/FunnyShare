import React from "react";
import { render } from "@testing-library/react";
import PostFeed from "./PostFeed";
import * as apiCalls from "../api/apiCalls";

const setup = (props) => {
  return render(<PostFeed {...props} />);
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

describe("PostFeed", () => {
  describe("Lifecycle", () => {
    it("calls loadPosts when it is rendered", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadPosts).toHaveBeenCalled();
    });

    it("calls loadPosts with user parameter when it is rendered with user property", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadPosts).toHaveBeenCalledWith("user1");
    });

    it("calls loadPosts without user parameter when it is rendered without user property", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadPosts.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });
  });

  describe("Layout", () => {
    it("displays no post message when the response has empty page", async () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      const { findByText } = setup();
      const message = await findByText("There are no posts");
      expect(message).toBeInTheDocument();
    });
  });
});
