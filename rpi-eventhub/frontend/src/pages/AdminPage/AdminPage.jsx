import React, { useEffect, useState, useContext } from 'react';
import styles from './AdminPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Skeleton } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

function AdminPage() {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({});
  const [error, setError] = useState(null);

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

  return (
    <div className={`outterContainer ${isDark ? 'text-white bg-[#120451]' : 'text-black bg-gradient-to-r from-gray-200 via-blue-200 to-blue-400'}`} data-theme={theme}>
      <Navbar />
      <div className="container-fluid containerFluid">
        {/* Page Title and Introduction */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <h4 className={styles.boldTitle}>Admin Dashboard</h4>
            <p className={styles.description}>
              Welcome to the Admin Dashboard. Here, you can manage users, monitor events, and review site feedback.
            </p>
          </div>
        </div>

        {/* Admin Tools and Actions */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <h4 className={styles.sectionTitle}>Admin Tools</h4>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className={styles.adminTool}>
                  <h5>Manage Users</h5>
                  <p>Search for and manage user accounts by RCS ID.</p>
                  <button className={styles.actionButton} onClick={() => window.location.href = '/admin/search'}>
                    Go to User Search
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles.adminTool}>
                  <h5>Manage Events</h5>
                  <p>Create, update, or delete campus events.</p>
                  <button className={styles.actionButton} onClick={() => window.location.href = '/admin/events'}>
                    Go to Event Management
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Site Statistics or Recent Activity */}
        <div className="row">
          <div className="col-12 px-5 py-3">
            <h4 className={styles.sectionTitle}>Site Statistics</h4>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={150} />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className={styles.statsContainer}>
                <p><strong>Total Users:</strong> {adminStats.totalUsers}</p>
                <p><strong>Total Events:</strong> {adminStats.totalEvents}</p>
                <p><strong>Active Users This Week:</strong> {adminStats.activeUsersThisWeek}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
