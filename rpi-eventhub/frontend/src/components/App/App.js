import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { EventsProvider } from '../../context/EventsContext';


// Import your page components

import Home from '../../pages/Home/Home'; // Adjust path if needed
import Events from '../../pages/Events/Events'; // Adjust path if needed
import Playground from '../../pages/Playground/Playground'; // Adjust path if needed
import AboutUs from '../../pages/AboutUs/AboutUs'; // Adjust path if needed
import Experimental from '../../pages/Experimental/Experimental'; // Adjust path if needed
import AllEvents from "../../pages/Events/AllEventPage/AllEvents";

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
  {
    path: "/experimental",
    element: <Experimental />,
  },
  {
    path: "/all-events",
    element: <AllEvents />,
  }
]);

function App() {
  return (
    <AuthProvider> {/* Wrap RouterProvider with AuthProvider */}
      <EventsProvider>
        <RouterProvider router={router} />
      </EventsProvider>
    </AuthProvider>
  );
}

export default App;
