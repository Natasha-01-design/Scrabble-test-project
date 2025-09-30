import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import WinnerPage from "./pages/Winner";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/winner" element={<WinnerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
