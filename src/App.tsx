import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";

const Component1 = () => {
  return <h1>Component 1</h1>;
};

const Component2 = () => {
  return <h1>Component 2</h1>;
};

const App = () => {
  return useRoutes([
    { path: "/", element: <Component1 /> },
    { path: "component2", element: <Component2 /> },
  ]);
};

const AppWrapper = () => {
  return (
      <Router>
        <App />
      </Router>
  );
};

export default AppWrapper;

