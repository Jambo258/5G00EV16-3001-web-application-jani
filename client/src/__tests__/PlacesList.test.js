import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PlacesList from "../places/components/PlacesList";

const DUMMY_TODOS = [
  {
    id: "todo1",
    title: "Pick up groceries",
    imageUrl:
      "https://visitylojarvi.fi/wp-content/uploads/2016/11/ylojarvi-seitseminen-nuotiopaikka.jpg",
    creator: "user1",
  },
  {
    id: "todo2",
    title: "Pick up grandmother from airport",
    imageUrl:
      "https://www.himosjamsa.fi/assets/uploads/2021/03/isojarvi-laavu-scaled.jpg",
    creator: "user1",
  },
];

describe("todos list", () => {




  it("should show No todos found when the item array is empty", () => {
    render(
      <BrowserRouter>
        <PlacesList items={[]} />
      </BrowserRouter>
    );
    //screen.debug()
    expect(screen.getByText("No todos found.")).toBeInTheDocument();
  });

  it("should show a list of todos by user", () => {
    render(
      <BrowserRouter>
        <PlacesList items={DUMMY_TODOS} />
      </BrowserRouter>
    );
    //screen.debug()
    expect(screen.queryByText("No todos found.")).toBeNull();
    expect(screen.getByText("Pick up groceries")).toBeInTheDocument();
    expect(
      screen.getByText("Pick up grandmother from airport")
    ).toBeInTheDocument();
  });
});
