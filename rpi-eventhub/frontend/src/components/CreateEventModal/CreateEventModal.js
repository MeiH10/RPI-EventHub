import React from 'react';
import ReactDOM from 'react-dom';
import './CreateEventModal.css'; // Importing CSS for styles

// CreateEventModal component accepts props for showing the modal and toggling its visibility
const CreateEventModal = ({ isShowing, toggle }) => {
  // Render the modal only if it is meant to be shown
  return isShowing ? ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={toggle} /> // Overlay that dims the background and can be clicked to close the modal
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="modal-close-button" onClick={toggle}>
            &times; // Close button with an '×' symbol, closes modal on click
          </button>
        </div>
        <div className="modal-body">
          <h2>Create New Event</h2> // Modal title for creating a new event
          <form> // Form for entering event details
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" required /> // Input for event title
            </div>
            <div className="form-group">
              <label htmlFor="description">Event Description</label>
              <textarea id="description" name="description" required /> // Textarea for event description
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" required /> // Input for event date
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" required /> // Input for event location
            </div>
            <div className="form-group">
              <label htmlFor="keywords">Keywords</label>
              <input type="text" id="keywords" name="keywords" placeholder="comma, separated, list" required /> // Input for keywords associated with the event
            </div>
            <div className="form-group">
              <label htmlFor="poster">Event Poster</label>
              <input type="file" id="poster" name="poster" required /> // Input for uploading an event poster
            </div>
            <button type="submit" className="submit-button">Create Event</button> // Button to submit the form and create the event
          </form>
        </div>
      </div>
    </>,
    document.body // Using React portal to mount the modal content directly to the body of the document
  ) : null; // Render nothing if not showing
};

export default CreateEventModal; // Exporting CreateEventModal component
