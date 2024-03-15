import './App.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'; 
import RsvpButton from '../rsvp-button/RsvpButton';

function App() {

  const title = "aaaaaaaaaakk World";
  return (
    <div className="App">

      <Navbar />

      <div className="content">
        <h1>{title}</h1>
      </div>
      <Footer />
      <RsvpButton />
    </div>
  )
}

export default App;
