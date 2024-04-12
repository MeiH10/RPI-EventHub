import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for DOM rendering
import './index.css'; // Global styles for the application
import App from './components/App/App'; // Main App component
import reportWebVitals from './reportWebVitals'; // Utility for measuring performance

// Create a root container instance using ReactDOM and bind it to the 'root' element in the HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> // Render the App component inside React's Strict Mode
  </React.StrictMode>
);

// Call the reportWebVitals function to measure and report on performance metrics
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
