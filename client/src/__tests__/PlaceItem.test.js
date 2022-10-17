import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PlaceItem from "../places/components/PlaceItem";

describe("Place todo", () => {
  const DUMMY_TODO = {
    id: "todo1",
    title: "Pick up mother from train station",
    imageUrl:
      "https://www.himosjamsa.fi/assets/uploads/2021/03/isojarvi-laavu-scaled.jpg",

    creator: "user1",
  };

  it("should show the todo details", () => {
    render(
      <BrowserRouter>
        <PlaceItem
          key={DUMMY_TODO.id}
          id={DUMMY_TODO.id}
          image={DUMMY_TODO.imageUrl}
          title={DUMMY_TODO.title}

        />
      </BrowserRouter>
    );
    //screen.debug()
    expect(
      screen.getByText("Pick up mother from train station")
    ).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveClass("place-item");

  });
});


