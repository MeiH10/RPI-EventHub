import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';


const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID; 
const imgBB_API_KEY = process.env.REACT_APP_imgBB_API_KEY; 




function CreateEventModal() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const uploadImageToImgur = async (file) => {
    const formData = new FormData();
    formData.append('image', file);


    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {

      headers: {
        'Authorization': `Client-ID ${clientId}`
      }

    });

      console.log("imageurl: ", response.data.data.link);
      return response.data.data.link; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null; // In case of error, return null
    }
  };


  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("response.data.data.url: ", response.data.data.url);
      return response.data.data.url;  // This will return the URL of the uploaded image
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleCreateEvent = async () => {
    let imageUrl = null;
    if (file) {
      imageUrl = await uploadImage(file);
    }

    const eventData = {
      title,
      description,
      poster: "admin",  // Hardcoded poster value
      image: imageUrl, // Use the uploaded image URL
      date,
      location,
      tags: tags.split(',').map(tag => tag.trim()) // Convert tags string to array
    };

    console.log("eventData: ", eventData);

    try {
      await axios.post('http://localhost:5000/events', eventData); // Adjust the URL to your API endpoint
      console.log('Event created successfully');
      handleClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
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
    </>
  );
}

export default CreateEventModal;
