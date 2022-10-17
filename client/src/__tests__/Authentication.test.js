import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Authenticate from "../users/pages/Authenticate";

describe("Authentication test", () => {
  it("should find certain elements on authenticate form", () => {
    render(
      <BrowserRouter>
        <Authenticate />
      </BrowserRouter>
    );
    //screen.debug()
    expect(
      screen.getByRole("button", { name: "Signup instead?" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Signup instead?" })).toHaveClass(
      "button button--default button--inverse undefined"
    );
    expect(
      screen.getByRole("button", { name: "LOGIN" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LOGIN" })).toHaveClass(
      "button button--default undefined undefined"
    );

  });
});
