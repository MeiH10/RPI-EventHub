import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar from Material-UI
import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';
import { useAuth } from "../../context/AuthContext";


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


function CreateEventModal() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // null means no message, true means success, false means error
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');
  const [rsvp, setRSVP] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [successOpen, setSuccessOpen] = useState(false); // State for success alert
  const [failureClose, setClose] = useState(false); // State for success alert
  const [errorOpen, setErrorOpen] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addEvent } = useEvents();


  const { isLoggedIn, emailVerified, username } = useAuth();


  const handleClose = () => {
    setShow(false);
    setError('');  // Clear errors when closing modal
  };

  const handleShow = () => setShow(true);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = (field) => {
    setErrorOpen((prev) => ({ ...prev, [field]: false }));
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if(isSubmitting) {
      return;
    }
    setIsSubmitting(true);    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    console.log('username: ', username);
    formData.append('poster', username); 
    formData.append('file', file); // Attach the file
    formData.append('date', date);
    formData.append('location', location);
    formData.append('tags', tags);
    formData.append('time', time);
    formData.append('club', club);
    formData.append('rsvp', rsvp);
    
    let errors = {};
    if (!title) errors.title= true; 
    if (!description) errors.description = true; 
    if (!date) errors.date = true;
    if (!location) errors.location = true;
    if (!time) errors.time = true;
    if (!club) errors.club = true;


    if (!description || !title || !location || !date || !time || !club) {
      setError('Please fill in all fields. Tags, File, and RSVP Link are optional!');
      return;
    }


    if (!isLoggedIn || !emailVerified) {
      setError('Only verified users can create event. Please login or get verified');
      return;
    }

    if (Object.keys(errors).length === 0) {
      setSuccessOpen(true);

    try {
      const { data } = await axios.post('http://localhost:5000/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addEvent(data); // Add the new event to the global context
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
}

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
        {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                //isInvalid={!title}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                //isInvalid={!description}
              />
            </Form.Group>
            <Form.Group controlId="eventClub">
              <Form.Label>Club <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter club name"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                //isInvalid={!club}
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
              <Form.Label>Date <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="date"
                placeholder="Event date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                //isInvalid={!date}
              />
            </Form.Group>
            <Form.Group controlId="eventTime">
              <Form.Label>Time <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="time"
                required
                placeholder="Event time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                //isInvalid={!time}
              />
            </Form.Group>

            <Form.Group controlId="eventLocation">
              <Form.Label>Location <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                //isInvalid={!location}
              />
            </Form.Group>
            <Form.Group controlId="eventRSVP">
              <Form.Label>RSVP Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter RSVP Link"
                value={rsvp}
                onChange={(e) => setRSVP(e.target.value)}

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
          <Button variant="primary" onClick={handleCreateEvent} disabled={isSubmitting}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessAlert open={successOpen} handleClose={handleSuccessClose} />

    </>
  );
}

export default CreateEventModal;
