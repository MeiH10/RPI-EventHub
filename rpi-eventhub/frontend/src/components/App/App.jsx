import React from 'react';
import ReactGA from "react-ga4";
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { EventsProvider } from '../../context/EventsContext';
import { ThemeProvider } from '../../context/ThemeContext'; // Import ThemeProvider

// Import your page components

import Home from '../../pages/Home/Home'; // Adjust path if needed
import Events from '../../pages/Events/Events'; // Adjust path if needed
import Playground from '../../pages/Playground/Playground'; // Adjust path if needed
import AboutUs from '../../pages/AboutUs/AboutUs'; // Adjust path if needed
import Experimental from '../../pages/Experimental/Experimental'; // Adjust path if needed
import AllEvents from "../../pages/Events/AllEventPage/AllEvents";
import SearchResults from '../../pages/SearchResults/SearchResults'; // Adjust path if needed
import EventDetails from '../../pages/EventDetails/EventDetails';
import Calendar from '../../pages/Calendar/Calendar';
import AdminPage from '../../pages/AdminPage/AdminPage';
import TermsOfService from '../../pages/TermsOfService/TermsOfService';

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
    path: "/search",
    element: <SearchResults />,
  },
  
  {
    path: "/all-events",
    element: <AllEvents />,
  },
  {
    path: "/events/:eventId", // Dynamic route for event details
    element: <EventDetails />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />
  },
  {
    path: "/admin",
    element: <AdminPage />
  }
]);

function App() {
  ReactGA.initialize('G-YTNJC09YQ1')
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <RouterProvider router={router} />
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
