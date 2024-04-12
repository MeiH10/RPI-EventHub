import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Import page components from their respective directories
import Home from '../../pages/Home/Home'; // Home page component
import Events from '../../pages/Events/Events'; // Events page component
import Playground from '../../pages/Playground/Playground'; // Playground page for testing or demos
import AboutUs from '../../pages/AboutUs/AboutUs'; // About Us page component
import Experimental from '../../pages/Experimental/Experimental'; // Experimental page for new features

// Creating a router instance using `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/", // Route path for home
    element: <Home />, // Component rendered at the home route
  },
  {
    path: "/events", // Route path for events
    element: <Events />, // Component rendered at the events route
  },
  {
    path: "/about-us", // Route path for about us
    element: <AboutUs />, // Component rendered at the about us route
  },
  {
    path: "/playground", // Route path for playground
    element: <Playground />, // Component rendered at the playground route
  },
  {
    path: "/experimental", // Route path for experimental
    element: <Experimental />, // Component rendered at the experimental route
  },
]);

// Main App component that utilizes the RouterProvider to manage routing
function App() {
  return (
    <RouterProvider router={router} /> // RouterProvider passes the routing context to components
  );
}

export default App; // Export the App component for use in index.js
