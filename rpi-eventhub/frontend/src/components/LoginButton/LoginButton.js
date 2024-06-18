import LoginButtonCSS from './LoginButton.module.css'

const LoginButton = () => {
    return ( 
        <div>
            <button>Login</button>
            <div className={LoginButtonCSS.modal} id="modal">
                <div className={LoginButtonCSS['modal-header']}>
                    Header
                </div>

                <div className={LoginButtonCSS['modal-body']}>
                    dksamdlksamdlksamdlksamd
        
                </div>

            </div>
        </div>
    );
};


//allows other files to import and use the RSVP button
export default LoginButton;