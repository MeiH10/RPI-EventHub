import styles from './LoginButton.module.css';

const LoginButton = () => {
    return ( 
        <div>
            <button>Login</button>
            <div className={styles.modal} id="modal">
                <div className={styles.modalHeader}>
                    Header
                </div>
                <div className={styles.modalBody}>
                </div>
            </div>
        </div>
    );
};

// Allows other files to import and use the RSVP button
export default LoginButton;
