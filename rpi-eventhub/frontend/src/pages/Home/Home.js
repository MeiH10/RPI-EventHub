import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HomeCSS from './Home.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";


const Home = () => {
  return (
    <div>
      <NavBar />

      <div className={`${HomeCSS.content} container-fluid`}>
        {/* Hero section */}
        <div className="row">
          <div className="col-7 p-5">

            <div className="title">
              <h1>All RPI events,</h1>
              <h1>in one place.</h1>
            </div>
            {/* <SearchBar /> */}

            <div className={HomeCSS.grid}>

              <svg width="100%" height="100" style={{ backgroundColor: '#35d415' }} className="my-5">
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d">SearchBar Placeholder</text>
              </svg> 
              <div className="card text-start bg-transparent border-0 p-0">
                <div class="card-body p-0">
                  <h5 class="card-title">About the website</h5>
                  <p class="card-text">A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</p>
                </div>           
              </div>



            </div>
             <hr  className="text-start" /> 

          </div>

          <div className={`${HomeCSS.carouselContainer} col-5`}>
            {/* <SearchBar /> */}
            <ImageCarousel></ImageCarousel>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
