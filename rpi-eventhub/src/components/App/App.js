import './App.css';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import Footer from '../Footer/Footer'

function App() {

  const title = "aaaaaaaaaakk World";
  return (
    <div className="App">
        <Navbar />
      <div className="content">
        <h1>{title}</h1>
        lroIVuZlGa8ETfD7EGAADlIveuo8EVCNnTtjQUaw19L8SaPTOmw
      </div>
      <Footer />
    </div>
  )
}

export default App;
