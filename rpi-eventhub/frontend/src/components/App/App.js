import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Import your page components
import Home from '../../pages/Home/Home'; // Adjust path if needed
import Events from '../../pages/Events/Events'; // Adjust path if needed
import Playground from '../../pages/Playground/Playground'; // Adjust path if needed
import AboutUs from '../../pages/AboutUs/AboutUs'; // Adjust path if needed

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;