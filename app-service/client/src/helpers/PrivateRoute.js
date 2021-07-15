import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from "react-redux";
import { userSelector } from "../features/user/userSlice";
export const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = useSelector(userSelector);
  return <Route
    {...rest}
    render={(props) =>
        user? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
};