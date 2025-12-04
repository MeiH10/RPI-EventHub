import FooterCSS from './Footer.module.css'
import { useColorScheme } from '../../hooks/useColorScheme';


const Footer = () => {
  const { isDark } = useColorScheme();
  
  return (
    <footer
      className={FooterCSS.footer}
      style={{ backgroundColor: isDark ? '#272727' : '#D6001C' }}
    >
      <p className={FooterCSS.footerText}>@RPI EventHub <span className={FooterCSS.flexItem}>|</span> <a href='https://github.com/MeiH10/RPI-EventHub' ><i className="bi bi-github"></i></a> <span className={FooterCSS.flexItem}>|</span> <a href='https://github.com/MeiH10/RPI-EventHub' className={`${FooterCSS.gitHubURL}`}>An RCOS project</a></p>
    </footer>
  );
};

export default Footer;
