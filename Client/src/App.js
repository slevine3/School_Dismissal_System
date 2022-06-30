import Home from "./pages/Home/Home";
import Update from "./pages/Update/Update";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login/login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/update" element={<Update />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
