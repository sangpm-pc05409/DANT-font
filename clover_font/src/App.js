import './App.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout và Navbar
import FacebookNavbar from './components/navbar/client/navbar';
import NavAdmin from './components/navbar/admin/Navbar';

// Các trang của user
import Index from './components/pages/client/index';
import Profile from './components/pages/client/Profile/profile';
import ProductGallery from './components/pages/client/ProductGallery/ProductGallery';
import Cart from './components/pages/client/Cart/cart';
import ProductDetail from './components/pages/client/ProductDetail/productDetail';
import OrderSummary from './components/pages/client/OrderSummary/OrderSummary';
import Order from './components/pages/client/OderCilent/oder_client';
import UserProfile from './components/pages/client/UserProfile/UserProfile';


// Trang login
import Login from './components/pages/client/Login/Login';

// Các trang của admin
import AccountManagement from './components/pages/Admin/AccountManagement/AccountManagement';
import SupplierList from './components/pages/Admin/Supplier/Supplier';
import PostList from './components/pages/Admin/Post/Post';
import StaticalAd from './components/pages/Admin/StaticalAd/StaticalAd';
import PropertyManager from './components/pages/Admin/Property/Property';
import PropertyValueManager from './components/pages/Admin/PropertiesValues/PropertiesValue';
//chat
import ChatApp from './components/pages/client/chat/chat';
// import ChatItem from './components/pages/client/chat/ChatItem';
// import WelcomeScreen from './components/pages/client/chat/welcomeScreen';
// import ChatScreen from './components/pages/client/chat/ChatScreen';

// Layout component cho user
function UserLayout() {
  return (
    <div>
      <FacebookNavbar />
      <div className="content">
        <Routes>
          <Route path="index" element={<Index />} />
          <Route path="profile" element={<Profile />} />
          <Route path="productGallery" element={<ProductGallery />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<Order />} />
          <Route path="orderSummary" element={<OrderSummary />} />
          <Route path="chat" element={<ChatApp />} />
          {/* <Route exact path="/chat" component={ChatScreen} />
          <Route path="/" component={WelcomeScreen} /> */}

          <Route path="*" element={<Navigate to="/user/index" />} />
        </Routes>
      </div>
    </div>
  );
}

// Layout component cho admin
function AdminLayout() {
  return (
    <div >
      <NavAdmin />
      <div className="content">
        <div style={{ padding: '20px', marginLeft: '250px', width: 'calc(100% - 250px)' }}>
          <Routes>
            <Route path="account-management" element={<AccountManagement />} />
            <Route path="supplier-management" element={<SupplierList />} />
            <Route path="post-management" element={<PostList />} />
            <Route path="stactial-management" element={<StaticalAd />} />
            <Route path="property-management" element={<PropertyManager />} />
            <Route path="properties-values-management" element={<PropertyValueManager />} />
            <Route path="*" element={<Navigate to="/admin/account-management" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho trang login */}
        <Route path="/login" element={<Login />} />

        {/* Điều hướng tới trang người dùng chính nếu không có đường dẫn */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Layout và route cho user */}
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="profiles/:userName" element={<UserProfile />} />
        {/* Layout và route cho admin */}

        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Điều hướng tới trang user nếu không khớp route */}
        <Route path="*" element={<Navigate to="/user/index" />} />
      </Routes>
    </Router>
  );
}

export default App;
