import React, {useEffect} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {SelectedProjectProvider, useProjectsValue, UserProvider} from "./context";
import {Home} from "./components/page/Home";
import {SignIn} from "./components/page/SignIn";
import {SignUp} from "./components/page/SignUp";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import {PrivateSingIn} from "./components/routes/PrivateSingIn";
import {PrivateSingUp} from "./components/routes/PrivateSingUp";

export const App = () => {

    if (!localStorage.getItem('selectedProject')) {
        localStorage.setItem('selectedProject', 'INBOX');
    }

    return (
      <UserProvider>
          <SelectedProjectProvider>
              <Router>
                  <Switch>
                      <PrivateRoute exact path="/" component={Home} />
                      <PrivateSingIn path="/signIn" component={SignIn} />
                      <PrivateSingUp path="/signUp" component={SignUp} />
                  </Switch>
              </Router>
          </SelectedProjectProvider>
      </UserProvider>
  );
};

