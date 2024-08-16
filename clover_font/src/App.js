import logo from './logo.svg';
import './App.css';
import Index from './components/pages/client/index'; // Chỉnh sửa chữ cái đầu thành chữ hoa
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Giả định UserLayout đã được định nghĩa, nếu không hãy import hoặc định nghĩa nó
// import UserLayout from './components/layouts/UserLayout'; 

function App() {
  return (
    <Router>
      <div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/index" />} />
            {/* user */}
              <Route path="/index" element={<Index />} />
            {/* admin */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
