import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from "../../context/AuthContext";
import config from '../../config';
import styles from './CreateEventModal.module.css';
import { DateTime } from 'luxon';

function CreateEventModal() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');
  const [rsvp, setRSVP] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedTags = [
    'fun', 'games', 'board games', 'food', 'social', 'competition', 
    'movie', 'anime', 'academic', 'professional', 'career', 'relax',
    'outdoor', 'workshop', 'fundraiser', 'art', 'music', 'networking', 
    'sports', 'creative', 'tech', 'wellness', 'coding', 'other'
  ];

  const { addEvent } = useEvents();
  const { isLoggedIn, emailVerified, username } = useAuth();

  const handleClose = () => {
    setShow(false);
    setError(''); 
  };

  const handleShow = () => setShow(true);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setShow(false);
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setError('');
    setIsSubmitting(true);
  
    // convert the start and end times to UTC before sending to the server
    const startDateTimeUTC = DateTime.fromISO(startDateTime, { zone: 'local' }).toUTC().toISO();
    const endDateTimeUTC = DateTime.fromISO(endDateTime, { zone: 'local' }).toUTC().toISO();
  
    const uniqueTags = tags.join(', ');
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('poster', username);
    formData.append('file', file); // Attach the file
    formData.append('startDateTime', startDateTimeUTC);
    formData.append('endDateTime', endDateTimeUTC);
    formData.append('location', location);
    formData.append('tags', uniqueTags);
    formData.append('club', club);
    formData.append('rsvp', rsvp);
  
    if (!title || !description || !startDateTime || !endDateTime || !location || !club) {
      setError('Please fill in all fields. Tags, File, and RSVP Link are optional!');
      setIsSubmitting(false);
      return;
    }
  
    if (!isLoggedIn || !emailVerified) {
      setError('Only verified users can create an event. Please login or get verified.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const { data } = await axios.post(`${config.apiUrl}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addEvent(data); 
      setSuccessOpen(true); 
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };  


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (selectedFile.size > maxSizeInBytes) {
        setError(`File size should not exceed ${maxSizeInMB}MB.`);
        setFile(null);
    } else {
        setFile(selectedFile);
    }
  };

  const handleAddTag = (tag) => {
    setTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else if (prevTags.length < 10) {
        return [...prevTags, tag];
      }
      return prevTags;
    });
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
              <Form.Label className={styles.formLabel}>File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept='.jpg, .jpeg, .png, .webp'
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventStartDateTime" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Start Date & Time <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventEndDateTime" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>End Date & Time <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
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
              <Form.Label className={styles.formLabel}>Tags</Form.Label>
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
