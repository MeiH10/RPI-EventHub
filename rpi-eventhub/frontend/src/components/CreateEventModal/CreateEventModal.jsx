import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from "../../context/AuthContext";
import config from '../../config';
import styles from './CreateEventModal.module.css'; // Import the CSS module
import { useColorScheme } from '../../hooks/useColorScheme'; // Assuming you have this hook
import { DateTime } from 'luxon';
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;


///////////////////File Upload////////////////////
const handleFileChange = (e, setPreview, setFile, setError) => {
  e.preventDefault();
  const selectedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  const maxSizeInMB = 10;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  // get the name of the file, trim .pdf or .jpg
  let fileName = selectedFile.name;

  if (selectedFile.numPages > 1) {
    console.log("PDF file should only have 1 page.");
    setError('PDF file should only have 1 page.');
    setFile(null);
    return;
  }else if (selectedFile.size > maxSizeInBytes) {
    console.log(`File size should not exceed ${maxSizeInMB}MB.`);
    setError(`File size should not exceed ${maxSizeInMB}MB.`);
    setFile(null);
    return;
  }

  if (selectedFile.type === 'application/pdf') {
    console.log("PDF file detected.");
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);

      // Get the document
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const numPages = pdf.numPages;
      const imagesArray = [];

      // Load and convert each page to image
      for (let i = 1; i <= numPages; i++) {
        const img = await getPage(i, pdf);
        imagesArray.push(img);
      }
      //change the base64 image to file
      setPreview(imagesArray[0]);
      //change the file name to the .jpg file
      fileName = fileName.replace(/\.[^/.]+$/, ".jpg");
      const new_file = base64ToFile(imagesArray[0], fileName);
      setFile(new_file);
    };
    reader.readAsArrayBuffer(selectedFile);
  }
  else if (selectedFile.type.match(/image.*/)) {
    console.log("Image file detected.");
    const reader = new FileReader();
    reader.onload = function (e) {
      setPreview(e.target.result);
      // change the base64 image to file
      const new_file = base64ToFile(e.target.result, fileName);
      setFile(new_file);
    };
    reader.readAsDataURL(selectedFile);
  }
  //alert if the file is not an image or pdf
  else {
    console.log("File type not supported.");
    alert('File type not supported. Please upload an image or PDF file.');
    setFile(null);
  }
}

const base64ToFile = (base64, filename) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const getPage = (num, pdf) => {
  return new Promise((resolve, reject) => {
    pdf.getPage(num).then(page => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext,
        viewport
      }).promise.then(() => {
        resolve(canvas.toDataURL());
      }).catch(reject);
    }).catch(reject);
  });
};



function CreateEventModal() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');
  const [rsvp, setRSVP] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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
  const { isLoggedIn, role, username } = useAuth();

  const handleClose = () => {
    setShow(false);
    setError('');
  };

  const handleShow = () => setShow(true);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setShow(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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

    if (startDateTime && endDateTime && new Date(endDateTime) < new Date(startDateTime)) {
      setError('End time must be after start time');
      setIsSubmitting(false);
      return;
    }

    // convert the start and end times to UTC before sending to the server
    const startDateTimeUTC = DateTime.fromISO(startDateTime, { zone: 'local' }).toUTC().toISO();
    const endDateTimeUTC = DateTime.fromISO(endDateTime, { zone: 'local' }).toUTC().toISO();

    const uniqueTags = tags.join(', ');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('poster', username);
    formData.append('file', file); // Attach the file
    console.log(file);
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


    console.log("isLoggedIn: ", isLoggedIn);
    console.log("role: ", role);

    if (!isLoggedIn || role === UNVERIFIED) {
      setError('Only verified users can create an event. Please login or get verified.');
      setIsSubmitting(false);
      return;
    }

    if (isLoggedIn && role === BANNED) {
      setError('You are banned from creating events. Please contact our admins for more information.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${config.apiUrl}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      addEvent(data);
      setSuccessOpen(true);
    } catch (error) {
      console.error('Failed to create event:', error);
      // Duplicate error catch
      if (error.response && error.response.data.message === 'Event with the same title and date already exists.') {
        setError('Event with the same title and date already exists. If you think it is a mistake please reach our admins.');
      } else {
        setError(error.response ? error.response.data.message : error.message);
      }
    } finally {
      setIsSubmitting(false);
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

  const handleImageFile = (e) => {
    handleFileChange(e, setPreview, setFile, setError);
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

            <Form.Label className={styles.formLabel}>File/Poster</Form.Label>
            <div
                onDrop={handleImageFile}
                onDragOver={handleDragOver}
                className={styles.fileDropArea}
            >
              <Form.Group controlId="eventFile">
                <Form.Label className={styles.fileFormLabel}>
                  Drag and drop a file here, or click to select a file
                </Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleImageFile}
                    accept='.jpg, .jpeg, .png, .webp, .pdf'
                    className={styles.formControl}
                    style={{display: 'none'}}
                />
                <Form.Label className={styles.fileFormLabelButton}>
                  Choose File
                </Form.Label>
              </Form.Group>
            </div>
            {
              preview && (
                <div>
                  <img src={preview} alt={"upload-file"} style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              )
            }


            <Form.Group controlId="eventStartDateTime" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Start Date & Time <span
                className='text-danger'>*</span></Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={startDateTime}
                onChange={(e) => {
                  const selectedDateTime = e.target.value;
                  const currentDateTime = new Date().toISOString().slice(0, 16);
                  if (selectedDateTime < currentDateTime) {
                    setStartDateTime(currentDateTime);
                  } else if (endDateTime && selectedDateTime > endDateTime) {
                    setStartDateTime(currentDateTime);
                  } else {
                    setStartDateTime(selectedDateTime);
                  }
                }}
                className={styles.formControl}
                min={new Date().toISOString().slice(0, 16)}
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
export { handleFileChange };