import './App.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'; 

function App() {

  const title = "aaaaaaaaaakk World";
  return (
    <div className="App">

      <Navbar />

      <div className="content">
        <h1>{title}</h1>
      </div>
      <Footer />
    </div>
  )
}

export default App;
