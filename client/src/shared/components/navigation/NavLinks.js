import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context'

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext); //Linking our AuthContext from app /users/:userId // /users/:uid/delete

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && auth.role === "quest" && (
        <li>
          <NavLink to={`/${auth.userId}/todos`} exact>
            VIEW TODO LIST
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.role === "quest" && (
        <li>
          <NavLink to="/todos/new" exact>
            ADD THINGS TO TODO LIST
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/" exact>
            ALL USERS
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/users/${auth.userId}/delete`}>DELETE ACCOUNT</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/users/${auth.userId}`}>MY DATA CHANGE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;