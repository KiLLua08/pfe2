import React from 'react';
import { Navigate } from 'react-router-dom';



const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('token'); 
 
    const isAuthenticated = token !== null && token !== undefined;

 
 
 
  return (
    (isAuthenticated ) ? <Component {...rest} /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
