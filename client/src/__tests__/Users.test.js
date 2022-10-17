import React from "react";
import { render, screen } from "@testing-library/react";

import Users from '../users/pages/Users'

describe('Users', () => {
    it ('should show a loading spinner while waiting', () => {
        render(<Users />)
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
})