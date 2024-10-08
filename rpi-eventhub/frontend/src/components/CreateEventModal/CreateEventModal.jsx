import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from "../../context/AuthContext";
import { useColorScheme } from '../../hooks/useColorScheme'; // 引入 useColorScheme 钩子
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
  const { isDark } = useColorScheme(); // 使用 useColorScheme 钩子

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

  const modalStyles = {
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#000000' : '#fff',
      borderBottom: `1px solid ${isDark ? '#fff' : '#000'}`,
    },
    modalTitle: {
      fontSize: '1.5rem',
      color: isDark ? '#fff' : '#000',
    },
    modalBody: {
      backgroundColor: isDark ? '#000000' : '#fff',
      color: isDark ? '#fff' : '#000',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#000000' : '#fff',
      borderTop: `1px solid ${isDark ? '#fff' : '#000'}`,
    },
    formGroup: {
      marginBottom: '1rem',
    },
    formLabel: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    textDanger: {
      color: 'red',
    },
    formControl: {
      width: '100%',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      backgroundColor: isDark ? '#444' : '#fff',
      border: `1px solid ${isDark ? '#666' : '#ced4da'}`,
      borderRadius: '0.25rem',
      color: isDark ? '#fff' : '#000',
    },
    formControlTextarea: {
      height: '100px',
    },
    button: {
      marginRight: '0.5rem',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
    },
    buttonPrimary: {
      backgroundColor: isDark ? '#0056b3' : '#007bff',
      color: '#fff',
    },
    buttonSecondary: {
      backgroundColor: isDark ? '#494949' : '#6c757d',
      color: '#fff',
    },
    alert: {
      marginBottom: '1rem',
    },
    alertSuccess: {
      backgroundColor: isDark ? '#155724' : '#d4edda',
      color: isDark ? '#fff' : '#155724',
    },
    alertDanger: {
      backgroundColor: isDark ? '#721c24' : '#f8d7da',
      color: isDark ? '#fff' : '#721c24',
    },
    suggestedTags: {
      marginTop: '0.5rem',
    },
    suggestedTagButton: {
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
      backgroundColor: isDark ? '#555' : 'transparent',
      color: isDark ? '#fff' : '#5786d2',
      border: `1px solid ${isDark ? '#555' : '#5786d2'}`,
    },
    suggestedTagButtonSelected: {
      backgroundColor: '#0056b3',
      color: '#fff',
    },
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
        <Modal.Header closeButton style={modalStyles.modalHeader}>
          <Modal.Title style={modalStyles.modalTitle}>Create an Event</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyles.modalBody}>
          {error && <Alert variant="danger" style={modalStyles.alertDanger}>{error}</Alert>}
          {successOpen && <Alert variant="success" style={modalStyles.alertSuccess}>Event created successfully!</Alert>}
          <Form>
            <Form.Group controlId="eventTitle" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>Title <span style={modalStyles.textDanger}>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={modalStyles.formControl}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>Description <span style={modalStyles.textDanger}>*</span></Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...modalStyles.formControl, ...modalStyles.formControlTextarea }}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventClub" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>Club/Organization <span style={modalStyles.textDanger}>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter club or organization name"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                style={modalStyles.formControl}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventFile" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept='.jpg, .jpeg, .png, .webp'
                style={modalStyles.formControl}
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

            <Form.Group controlId="eventLocation" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>Location <span style={modalStyles.textDanger}>*</span></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={modalStyles.formControl}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventRSVP" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>RSVP Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter RSVP Link"
                value={rsvp}
                onChange={(e) => setRSVP(e.target.value)}
                style={modalStyles.formControl}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="eventTags" style={modalStyles.formGroup}>
              <Form.Label style={modalStyles.formLabel}>Tags</Form.Label>
              <div style={modalStyles.suggestedTags}>
                {suggestedTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant={tags.includes(tag) ? 'primary' : 'outline-primary'}
                    style={tags.includes(tag) ? { ...modalStyles.suggestedTagButton, ...modalStyles.suggestedTagButtonSelected } : modalStyles.suggestedTagButton}
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer style={modalStyles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} style={{ ...modalStyles.button, ...modalStyles.buttonSecondary }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent} disabled={isSubmitting} style={{ ...modalStyles.button, ...modalStyles.buttonPrimary }}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateEventModal;