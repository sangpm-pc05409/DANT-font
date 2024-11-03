import './App.css';
import Index from './components/pages/client/index'; // Assuming correct path
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import FacebookNavbar from './components/navbar/client/navbar';
import Profile from './components/pages/client/Profile/profile';
import ProductGallery from './components/pages/client/ProductGallery/ProductGallery';
import Cart from './components/pages/client/Cart/cart';
import ProductDetail from './components/pages/client/ProductDetail/productDetail';
import OrderSummary from './components/pages/client/OrderSummary/OrderSummary';
import Login from './components/pages/client/Login/Login'; // Import the Login component

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        {/* Navbar chỉ hiển thị khi không phải là trang đăng nhập */}
        {window.location.pathname !== "/" && <FacebookNavbar />}
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/index" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/productGallery" element={<ProductGallery />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orderSummary" element={<OrderSummary />} />
            {/* Redirect to Login if the route is not matched */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
