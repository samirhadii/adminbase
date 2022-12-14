import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import AddEditMovie from "./pages/AddEditMovie";
import AddEditNewMovie from "./pages/AddEditNewMovie";
import AddEditPromo from "./pages/AddEditPromo";
import Home from './pages/Home';
import NavBar from "./components/NavBar";


//put <navbar/> under line 12
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/addmovie" element = {<AddEditMovie />} />
          <Route path="/updatemovie/:id" element = {<AddEditMovie />} />
          <Route path="/addpromo" element = {<AddEditPromo />} />
          <Route path="/updatepromo/:id" element = {<AddEditPromo />} />
          <Route path="/schedule" element = {<AddEditNewMovie />} />
          <Route path="/updateschedule/:id" element = {<AddEditNewMovie />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
