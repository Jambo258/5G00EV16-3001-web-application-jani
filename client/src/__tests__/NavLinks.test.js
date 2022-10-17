import React from "react";
import { render, screen } from "@testing-library/react";
import  NavLinks  from "../shared/components/navigation/NavLinks";
import { BrowserRouter } from "react-router-dom";
import {AuthContext} from '../shared/context/auth-context'
describe('Navigation Links', () => {
    it('should show only AUTHENTICATE on page without logging in', () => {
        render(
          <BrowserRouter>
            <NavLinks />
          </BrowserRouter>
        );
        //screen.debug()
        expect(screen.getByText("AUTHENTICATE")).toBeInTheDocument();
        expect(screen.getByText('AUTHENTICATE')).toHaveAttribute('href','/auth')
    })

    it('should show more navigation links when authorized', () => {
        render(
          <AuthContext.Provider
            value={{
              isLoggedIn: true,
              token: '1234567890-0987654321',
              userId: 'user1',
              role: 'admin',
              login: () => {},
              logout: () => {},
            }}
          >
            <BrowserRouter>
              <NavLinks />
            </BrowserRouter>
          </AuthContext.Provider>
        );

        expect(screen.getByRole("list")).toHaveClass("nav-links");
        expect(screen.getByText("DELETE ACCOUNT")).toBeInTheDocument();
        expect(screen.getByText("ALL USERS")).toHaveAttribute("href", "/");
        expect(screen.getByText("MY DATA CHANGE")).toBeInTheDocument();
        expect(screen.getByText("MY DATA CHANGE")).toHaveAttribute("href", "/users/user1");
        expect(screen.queryByText("AUTHENTICATE")).toBeNull();

        expect(screen.getByRole('button',{name:'LOGOUT'})).toBeInTheDocument();
    })
})
