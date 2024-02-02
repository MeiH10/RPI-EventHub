import './App.css';
import Navbar from '../Navbar/Navbar';


function App() {

  const title = "aaaaaaaaaakk World";
  return (
    <div className="App">

      <Navbar></Navbar>

      <div className="content">
        <h1>{title}</h1>
      </div>
    </div>
  )
}

export default App;
