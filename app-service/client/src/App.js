import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {Login} from './features/user/Login';
import {Signup} from './features/user/Signup';
import { PrivateRoute } from './helpers/PrivateRoute';
import './App.css';
import { MyLayout } from './components/Layout';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact component={Login} path="/login" />
          <Route exact component={Signup} path="/register" />
          <PrivateRoute exact component={MyLayout} path="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
