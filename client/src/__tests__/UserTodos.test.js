import React from "react";
import { render, screen } from "@testing-library/react";
import UserTodos from "../places/pages/UserTodos";

import { BrowserRouter } from "react-router-dom";

import UpdateTodo from "../places/pages/UpdateTodo";


describe("Update place and userplaces", () => {
  it("should test updateplace", () => {
    render(
      <BrowserRouter>
        <UpdateTodo />
      </BrowserRouter>
    );
    //screen.debug();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

  });

  it("should test userplaces", () => {
    render(
      <BrowserRouter>
        <UserTodos />
      </BrowserRouter>
    );
    //screen.debug();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

  });

});

