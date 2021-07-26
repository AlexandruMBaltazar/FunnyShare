import React from "react";
import { render } from "@testing-library/react";
import PostSubmit from "./PostSubmit";

describe("PostSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = render(<PostSubmit />);
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });

    it("has image", () => {
      const { container } = render(<PostSubmit />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
  });
});
