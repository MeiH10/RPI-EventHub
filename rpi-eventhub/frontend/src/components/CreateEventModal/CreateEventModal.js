import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from "../../context/AuthContext";
import config from '../../config';


function CreateEventModal() {
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
  const [errorOpen, setErrorOpen] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedTags = ['workshop', 'seminar', 'game', 'music', 'food','career','fun'];

  const { addEvent } = useEvents();
  const { isLoggedIn, emailVerified, username } = useAuth();

  const handleClose = () => {
    setShow(false);
    setError('');  // Clear errors when closing modal
  };

  const handleShow = () => setShow(true);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setShow(false); // Close the modal after success
  };

  const handleErrorClose = (field) => {
    setErrorOpen((prev) => ({ ...prev, [field]: false }));
  };

  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(handleSuccessClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [successOpen]);

  useEffect(() => {
    if (show) {
      setIsSubmitting(false);
    }
  }, [show]);

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
    if (isSubmitting) {
      return;
    }
    setError('');
    setIsSubmitting(true);

    // Normalize and deduplicate tags before submission
    const uniqueTags = Array.from(new Set(tags.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0))).join(', ');

    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('poster', username);
    formData.append('file', file); // Attach the file
    formData.append('date', date);
    formData.append('location', location);
    formData.append('tags', uniqueTags);

    formData.append('time', time);
    formData.append('club', club);
    formData.append('rsvp', rsvp);
    
    let errors = {};
    if (!title) errors.title = true;
    if (!description) errors.description = true;
    if (!date) errors.date = true;
    if (!location) errors.location = true;
    if (!time) errors.time = true;
    if (!club) errors.club = true;


    if (!description || !title || !location || !date || !time || !club) {
      setError('Please fill in all fields. Tags, File, and RSVP Link are optional!');
      setIsSubmitting(false);

      return;
    }

    if (!isLoggedIn || !emailVerified) {
      setError('Only verified users can create event. Please login or get verified');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.post(`${config.apiUrl}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addEvent(data); // Add the new event to the global context
      setSuccessOpen(true); // Show success message
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(error.response ? error.response.data.message : error.message); // Ensure the error is a string
    } finally {
      // setIsSubmitting(false);
    }
  };

  const handleAddTag = (tag) => {
    setTags((prevTags) => prevTags ? `${prevTags}, ${tag}` : tag);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };


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
          {successOpen && <Alert variant="success">Event created successfully!</Alert>}
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
              <Form.Label>Tags (comma separated, lowercase only)</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="e.g., workshop, seminar"
                value={tags}
                onChange={handleTagsChange}
                
              />
              <div className="mt-2">
                {suggestedTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className="mr-2 mb-2"
                    onClick={() => handleAddTag(tag)}
                    
                  >
                    {tag}
                  </Button>
                ))}
              </div>

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
    </>
  );
}

export default CreateEventModal;
