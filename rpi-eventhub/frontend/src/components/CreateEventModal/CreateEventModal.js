import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import Alert from '@mui/material/Alert'; // Import Alert from Material-UI
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar from Material-UI
import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;
const imgBB_API_KEY = process.env.REACT_APP_imgBB_API_KEY;

function SuccessAlert({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="success">
        Event successfully created!
      </Alert>
    </Snackbar>
  );
}

function FailureToEnterTitle({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to enter title!
      </Alert>
    </Snackbar>
  );
}

function FailureToEnterDescription({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to enter a description!
      </Alert>
    </Snackbar>
  );
}

function FailureToUploadFile({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to upload a file!
      </Alert>
    </Snackbar>
  );
}

function FailureToEnterDate({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to enter a date!
      </Alert>
    </Snackbar>
  );
}

function FailureToEnterLocation({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to enter a location!
      </Alert>
    </Snackbar>
  );
}

function FailureToEnterTags({ open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} icon={<CheckIcon fontSize="inherit" />} severity="error">
        Need to enter tags!
      </Alert>
    </Snackbar>
  );
}

function CreateEventModal() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // null means no message, true means success, false means error
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [successOpen, setSuccessOpen] = useState(false); // State for success alert
  const [failureClose, setClose] = useState(false); // State for success alert
  const [errorOpen, setErrorOpen] = useState({});

  const { addEvent } = useEvents(); // Use addEvent from EventsContext

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = (field) => {
    setErrorOpen((prev) => ({ ...prev, [field]: false }));
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`, formData);
      return response.data.data.url; // Return URL of uploaded image
    } catch (error) {
      console.error('Failed to upload image:', error);
      return ''; // Return empty string if upload fails
    }
  };

  const handleCreateEvent = async () => {
    let imageUrl = await uploadImage(file);
    let errors = {};
    if (!title) errors.title = true;
    if (!description) errors.description = true;
    if (!file) errors.file = true;
    if (!date) errors.date = true;
    if (!location) errors.location = true;
    if (!tags) errors.tags = true;

    setErrorOpen(errors);

    if (Object.keys(errors).length === 0) {
      setSuccessOpen(true);

      const eventData = {
        title,
        description,
        poster: "admin", // Temporary hardcode
        image: imageUrl || 'default-placeholder-image-url', // Use placeholder if upload fails
        date,
        location,
        tags: tags.split(',').map(tag => tag.trim()),
      };

      try {
        const { data } = await axios.post('http://localhost:5000/events', eventData);
        addEvent(data); // Add the new event to the global context
        handleClose(); // Close the modal
      } catch (error) {
        alert("not working");
        console.error('Failed to create event:', error);
        setClose(true); // Show success alert
        handleClose(); // Close the modal
      }
    }
  };

  useEffect(() => {
    if (isSuccess !== null) {
      const timer = setTimeout(() => {
        setIsSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  useEffect(() => {
    const timers = Object.keys(errorOpen).map((field) => {
      if (errorOpen[field]) {
        return setTimeout(() => {
          handleErrorClose(field);
        }, 3000);
      }
      return null;
    });
    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [errorOpen]);

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Create Event
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create an Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventFile">
              <Form.Label>File (Poster or PDF)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Event date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventTags">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., workshop, seminar"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessAlert open={successOpen} handleClose={handleSuccessClose} />
      <FailureToEnterTitle open={errorOpen.title} handleClose={() => handleErrorClose('title')} />
      <FailureToEnterDescription open={errorOpen.description} handleClose={() => handleErrorClose('description')} />
      <FailureToUploadFile open={errorOpen.file} handleClose={() => handleErrorClose('file')} />
      <FailureToEnterDate open={errorOpen.date} handleClose={() => handleErrorClose('date')} />
      <FailureToEnterLocation open={errorOpen.location} handleClose={() => handleErrorClose('location')} />
      <FailureToEnterTags open={errorOpen.tags} handleClose={() => handleErrorClose('tags')} />
    </>
  );
}

export default CreateEventModal;
