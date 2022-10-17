import React from "react";
import { render, screen } from "@testing-library/react";
import MainHeader from "../shared/components/navigation/MainHeader";

describe('Main Header', () => {
    it('should test main-header by testid', () => {
        render(

                <MainHeader/>

        );
        //screen.debug()
        expect(screen.getByTestId("main-header")).toBeInTheDocument();

    })

})