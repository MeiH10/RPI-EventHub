import React from 'react';
import ReactDOM from 'react-dom';
import './CreateEventModal.css'; // Make sure to create a corresponding CSS file

const CreateEventModal = ({ isShowing, toggle }) => {
  return isShowing ? ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={toggle} />
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="modal-close-button" onClick={toggle}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <h2>Create New Event</h2>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Event Description</label>
              <textarea id="description" name="description" required />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" required />
            </div>
            <div className="form-group">
              <label htmlFor="keywords">Keywords</label>
              <input type="text" id="keywords" name="keywords" placeholder="comma, separated, list" required />
            </div>
            <div className="form-group">
              <label htmlFor="poster">Event Poster</label>
              <input type="file" id="poster" name="poster" required />
            </div>
            <button type="submit" className="submit-button">Create Event</button>
          </form>
        </div>
      </div>
    </>,
    document.body
  ) : null;
};

export default CreateEventModal;
