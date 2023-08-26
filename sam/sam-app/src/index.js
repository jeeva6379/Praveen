import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App1 from "./App1";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App1 />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
