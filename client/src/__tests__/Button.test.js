import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "../shared/components/button/Button";
import { BrowserRouter } from "react-router-dom";


describe('Button', () => {
    it ('should render a normal button when no to or href prop', () => {
        render(
            <Button
                type={"button"}
                onclick={()=>{}}
                disabled={false}
            >
                My Normal Button
            </Button>

        );
        expect(screen.getByRole('button',{name: 'My Normal Button'})).toBeInTheDocument();

    })

    it("should render an anchor when to prop is set", () => {
        render(
          <Button href={'/users'}
          >
            My Anchor Button
          </Button>
        );
        //screen.debug();
        expect(
          screen.getByRole("link", { name: "My Anchor Button" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "My Anchor Button" })
        ).toHaveAttribute('href','/users');
        expect(
          screen.getByRole("link", { name: "My Anchor Button" })
        ).toHaveClass('button button--default');

    });

    it("should render a route Link when to prop is set", () => {
        render(
          <BrowserRouter>
            <Button to={"/users"}>My Link Button</Button>
          </BrowserRouter>
        );
        //screen.debug();
        expect(
          screen.getByRole("link", { name: "My Link Button" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "My Link Button" })
        ).toHaveAttribute("href", "/users");
        expect(
          screen.getByRole("link", { name: "My Link Button" })
        ).toHaveClass("button button--default");

    });
})
