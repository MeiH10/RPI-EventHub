import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from "../../context/AuthContext";
import config from '../../config';
import styles from './CreateEventModal.module.css'; 

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
  const [tags, setTags] = useState([]);
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
    setTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else if (prevTags.length < 10) {
        return [...prevTags, tag];
      }
      return prevTags;
    });
  };

  const handleTagsChange = (e) => {
    const inputTags = e.target.value.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
    setTags(inputTags.slice(0, 10));
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
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Create an Event</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {error && <Alert variant="danger">{error}</Alert>}
          {successOpen && <Alert variant="success">Event created successfully!</Alert>}
          <Form>
            <Form.Group controlId="eventTitle" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Title <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Description <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="eventClub">
              <Form.Label>Club/Organization <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter club or organization name"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="eventFile" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>File (Poster or PDF)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept='.pdf, .jpg, .jpeg, .png, .webp'
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventDate" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Date <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="date"
                placeholder="Event date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="eventTime" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Time <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="time"
                placeholder="Event time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventLocation" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Location <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="eventRSVP" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>RSVP Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter RSVP Link"
                value={rsvp}
                onChange={(e) => setRSVP(e.target.value)}
                className={styles.formControl}
              />
              
            </Form.Group>
            <Form.Group controlId="eventTags" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Tags (comma separated, max 10)</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="e.g., workshop, seminar"
                value={tags.join(', ')}
                onChange={handleTagsChange}
                className={styles.formControl}
              />
              <div className="mt-2">
                {suggestedTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant={tags.includes(tag) ? 'primary' : 'outline-primary'}
                    className={`${styles.suggestedTagButton} ${tags.includes(tag) ? styles.selected : ''}`}
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} className={styles.buttonSecondary}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent} disabled={isSubmitting} className={styles.buttonPrimary}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateEventModal;
