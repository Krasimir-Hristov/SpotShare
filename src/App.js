import React, { useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Auth from './user/pages/Auth';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';


let logoutTimer = undefined;

const App = () => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(undefined);

  const login = useCallback((userId, token, expirationDate) => {

    setToken(token);
    setUserId(userId);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {

    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);

    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {

    if (token && tokenExpirationDate) {

      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {

      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {

    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()) {

      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes = undefined;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
