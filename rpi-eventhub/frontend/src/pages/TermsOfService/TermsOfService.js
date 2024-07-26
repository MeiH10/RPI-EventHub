// src/pages/SearchResults/TermsOfService.jsx
import React from 'react';
import styles from './TermsOfService.module.css';
import { useLocation } from 'react-router-dom';
import EventPoster from '../../components/EventPosterOnly/EventPoster'; // Adjust the import path if necessary
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';

const TermsOfService = () => {
  return (
    <div className={styles.termsContainer}>
      <h1>Terms of Service</h1>
      <p><strong>Effective Date: 07/23/2024</strong></p>
      <p>
        Welcome to RPI EventHub. By using our website and its associated services, including event posting and management, you agree to comply with the following Terms of Service. Please read these Terms carefully.
      </p>
      <p>
        By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you should not use our Services.
      </p>
      <h2>When posting events on our Site, you agree to adhere to the following guidelines:</h2>
      
      <h3>Prohibited Content</h3>
      <ul>
        <li><strong>Inappropriate Content:</strong> Do not post any content that is obscene, vulgar, or sexually explicit.</li>
        <li><strong>Discriminatory Content:</strong> Do not post content that promotes discrimination, harassment, or violence against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.</li>
        <li><strong>Hate Speech:</strong> Do not post content that contains hate speech or incites violence or hatred against individuals or groups.</li>
        <li><strong>Illegal Activities:</strong> Do not post content that promotes or involves illegal activities, including but not limited to drug use, violence, or theft.</li>
        <li><strong>Misleading Information:</strong> Do not post false, misleading, or deceptive information about events.</li>
      </ul>
      
      <h3>Event Relevance</h3>
      <ul>
        <li>Ensure that all event postings are relevant and provide accurate information about the event, including date, time, location, and description.</li>
        <li>Avoid posting duplicate events or content unrelated to the event itself.</li>
      </ul>
      
      <h3>Respectful Behavior</h3>
      <ul>
        <li>Treat all users with respect and courtesy. Do not engage in harassment, threats, or abusive behavior.</li>
      </ul>
      
      <p>
        We reserve the right to monitor, review, and remove any content that violates these Terms or is otherwise deemed inappropriate. We may also suspend or terminate accounts of users who repeatedly violate these Terms.
      </p>
      
      <h3>Accuracy of Information</h3>
      <p>
        You are responsible for the accuracy and completeness of the information you provide when posting events.
      </p>
      <p>
        Our Services are provided "as is" without any warranties, express or implied. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Services or any content posted.
      </p>
      
      <p>
        We may update these Terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the Services constitutes your acceptance of the revised Terms.
      </p>
      <p>
        We reserve the right to terminate or suspend your access to RPI EventHub at our discretion, without notice, for any reason, including but not limited to violations of these Terms.
      </p>
      <p>Thank you for using RPI EventHub.</p>
    </div>
  );
};

export default TermsOfService;
