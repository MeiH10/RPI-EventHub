import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import Modal from '../Modal/Modal';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const handleRSVPClick = (isLink) => {
  ReactGA.event({
    category: 'RSVP',
    action: isLink ? 'RSVP Link Clicked' : 'RSVP Info Viewed'
  });
};

const RsvpButton = ({ rsvp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLink = isValidUrl(rsvp);

  const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200";

  if (isLink) {
    return (
      <a
        href={rsvp}
        onClick={() => handleRSVPClick(true)}
        className={buttonClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        RSVP
      </a>
    );
  }

  return (
    <>
      <button
        className={buttonClasses}
        onClick={() => {
          handleRSVPClick(false);
          setIsModalOpen(true);
        }}
      >
        RSVP Info
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="RSVP Information"
        className=""
      >
        <p className={`leading-relaxed`}>{rsvp}</p>
      </Modal>
    </>
  );
};

export default RsvpButton;
