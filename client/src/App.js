import React, { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import AddTodo from './places/pages/AddTodo';
import UpdateTodo from './places/pages/UpdateTodo';
import Users from './users/pages/Users';
import UserTodos from './places/pages/UserTodos';
import Authenticate from './users/pages/Authenticate';
import MainNavigation from './shared/components/navigation/MainNavigation'
import { AuthContext } from './shared/context/auth-context';
import UpdateUser from './places/pages/UpdateUser';
import DeleteUser from './places/components/DeleteUser';
//import PlacesList from './places/components/PlacesList';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [role, setRole] = useState("");

  const login = useCallback((uid, token, role, expirationDate) => {
    //prevent a render loop
    setToken(token);
    setUserId(uid);
    setRole(role);
    //current date in ms + 1h
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        role: role,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    //prevent a render loop
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // if greater, still in future
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.role,
        new Date(storedData.expiration)
      );
    }
  }, [login]);
  // /api/places//user/:uid
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:uid/todos" exact>
          <UserTodos />
        </Route>
        <Route path="/todos/new" exact>
          <AddTodo />
        </Route>
        <Route path="/todos/:tid">
          <UpdateTodo />
        </Route>
        <Route path="/users/:uid" exact>
          <UpdateUser />
        </Route>
        <Route path="/users/:uid/delete" exact>
          <DeleteUser />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
