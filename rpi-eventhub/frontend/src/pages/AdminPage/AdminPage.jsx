import React, { useEffect, useState, useContext } from 'react';
import styles from './AdminPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Skeleton } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from "../../context/AuthContext";
import { useColorScheme } from '../../hooks/useColorScheme';
import AdminSearch from '../../components/AdminSearch/AdminSearch'; // Import the search component

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

function AdminPage() {


  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({});
  const [error, setError] = useState(null);
  const { isLoggedIn, role, logout, manageMode, setManageMode } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    async function fetchAdminStats() {
      try {
        // Replace with actual API call for admin stats
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setAdminStats(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load statistics.');
      }
    }

    fetchAdminStats();
  }, []);

  // Explanation of each rank level
  const rankExplanations = [
    { level: 0, description: 'Banned: Banned users are unable to log in or intract with the site using their credentials.' },
    { level: 1, description: 'Unverified User: Unverified users are users who have signed up but have not verified their email.' },
    { level: 2, description: 'Verified User: Verified users are users who have signed up and have verified their email.' },
    { level: 3, description: 'Officer: Officers are users that are RPI employees and are affiliated with the school. Only assign faculty to this role, not any other user.' },
    { level: 4, description: 'Admin: Administrators have elevated privileges on the site and may edit other users or events.'}
  ];

  var Page = <div>
        <p>Unauthorized</p>
        </div>;

  if (role === 4) {
  Page =  <div className={`${isDark ? 'text-white bg-[#120451]' : 'text-black bg-gradient-to-r from-gray-200 via-blue-200 to-blue-400'}`} data-theme={theme}>
      <Navbar />
      <div className="container-fluid containerFluid">
        {/* Page Title and Introduction */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <h4 className='font-bold text-xl'>Admin Dashboard</h4>
            <p className=''>
              Welcome to the Admin Dashboard. Here, you can manage users and monitor events.
            </p>
          </div>
        </div>

        {/* Admin Search Section */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <h4 className='text-lg font-bold mb-4'>Admin Tools</h4>
            <div className={`${isDark ? 'bg-[#777] p-5 rounded-lg mb-5' : 'bg-[#f9f9f9] p-5 rounded-lg mb-5'}`}>
              <h5>Manage Users</h5>
              <p>Search for and manage user accounts by RCS ID.</p>
              <AdminSearch /> {/* Embed the search component directly */}
            </div>
          </div>
        </div>

        {/* Rank Explanation Section */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <div className={`${isDark ? 'bg-[#777] p-5 rounded-lg mb-5' : 'bg-[#f9f9f9] p-5 rounded-lg mb-5'}`}>
              <h5>Rank Explanation</h5>
              <p>Explanation of each rank and its permissions:</p>
              <ul className={`${isDark ? 'bg-[#777] list-none p-0' : 'list-none p-0'} `}>
                {rankExplanations.map((rank) => (
                  <li key={rank.level} className={`${isDark ? 'bg-[#777] my-2 text-base' : 'my-2 text-base'}`}>
                    <strong>Rank {rank.level}:</strong> {rank.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Manage Events Section */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <div className={`${isDark ? 'bg-[#777] p-5 rounded-lg mb-5' : 'bg-[#f9f9f9] p-5 rounded-lg mb-5'}`}>
              <h5>Manage Events</h5>
              <p>Create, update, or delete campus events.</p>
              <button className={styles.actionButton} onClick={() => window.location.href = '/all-events'}>
                Go to Event Management
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    ;
              } else {
                Page = <div>
                  <p>Unauthorized</p>
                </div>
              }
    return (

      <div>
        {Page}
      </div>

    );
}

export default AdminPage;