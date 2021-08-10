import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import PostFeed from "./PostFeed";
import * as apiCalls from "../api/apiCalls";
import { MemoryRouter } from "react-router";

const setup = (props) => {
  return render(
    <MemoryRouter>
      <PostFeed {...props} />
    </MemoryRouter>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

const mockSuccessGetPostsSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
};

const mockSuccessGetPostsFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
      {
        id: 9,
        content: "This is post 9",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetPostsLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
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

    it("does not display no post message when response has page of posts", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsSinglePage);

      const { queryByText } = setup();

      await waitFor(() => {
        expect(queryByText("There are no posts")).not.toBeInTheDocument();
      });
    });

    it("displays spinner when loading the hoaxes", async () => {
      apiCalls.loadPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetPostsSinglePage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      expect(queryByText("Loading...")).toBeInTheDocument();
    });

    it("displays hoax content", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsSinglePage);
      const { findByText } = setup();
      const hoaxContent = await findByText("This is the latest post");
      expect(hoaxContent).toBeInTheDocument();
    });

    it("displays Load More when there are next pages", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      expect(loadMore).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls loadOldPosts with post id when clicking Load More", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldPosts.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });

    it("calls loadOldPosts with post id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      const { findByText } = setup({ user: "user1" });
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldPosts).toHaveBeenCalledWith(9, "user1");
    });

    it("displays loaded old post when loadOldPost api call success", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const oldPost = await findByText("This is the oldest post");
      expect(oldPost).toBeInTheDocument();
    });

    it("hides Load More when loadOldPosts api call returns last page", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      await waitFor(() => {
        expect(loadMore).not.toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};
