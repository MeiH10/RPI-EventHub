import FooterCSS from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={FooterCSS.footer}>
      <p className={FooterCSS.footerText}>@RPI EventHub <span className={FooterCSS.flexItem}>|</span> <a href='https://github.com/MeiH10/RPI-EventHub' ><i className="bi bi-github"></i></a> <span className={FooterCSS.flexItem}>|</span> <a href='https://github.com/MeiH10/RPI-EventHub' className={`${FooterCSS.gitHubURL}`}>A RCOS project</a></p>
    </footer>
  );
};

export default Footer;
