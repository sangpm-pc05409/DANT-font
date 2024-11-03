import React, { useState, useEffect } from 'react';
import { Navbar, Form, FormControl, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FaRegBell } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu } from "react-icons/io";
import Logo from '../../images/Logo5.ico';
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const FacebookNavbar = () => {
  const navigate = useNavigate();
  
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  // Check if the token exists in localStorage to determine if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Update state to reflect that the user is logged out
    setIsLoggedIn(false);
    
    // Set a logout success message
    setLogoutMessage('Logout successful!');
    
    // Redirect to the login page
    navigate('/');

    // Hide the message after 3 seconds
    setTimeout(() => setLogoutMessage(''), 3000);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="border border-gray rounded shadow-sm">
        <Container fluid>
          <Row className="w-100 align-items-center">
            {/* Logo */}
            <Col xs="auto" className="d-flex align-items-center">
              <Navbar.Brand href="/index">
                <img
                  src={Logo}
                  width="60"
                  height="50"
                  className="d-inline-block align-top"
                  alt="Logo"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Col>

            {/* Search bar */}
            <Col className="p-3 d-flex justify-content-center align-items-center">
              <Form className="d-flex" style={{ width: '400px' }}>
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  style={{ borderRadius: '20px', width: '100%' }}
                />
              </Form>
            </Col>

            {/* Dropdown with user actions */}
            <Col xs="auto" className="d-flex align-items-center justify-content-end">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="fs-4 no-caret">
                  <IoMdMenu style={{ fontSize: '1.5rem' }} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/cart">
                    <FaCartShopping style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Cart
                  </Dropdown.Item>
                  <Dropdown.Item href="#messages">
                    <FaRegCommentDots style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Messages
                  </Dropdown.Item>
                  <Dropdown.Item href="#notifications">
                    <FaRegBell style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Notifications
                  </Dropdown.Item>
                  <Dropdown.Item href="/profile">
                    <CgProfile style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="/orderSummary">
                    <CgProfile style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Order Summary
                  </Dropdown.Item>

                  {/* Conditionally render the Logout option */}
                  {isLoggedIn && (
                    <Dropdown.Item onClick={handleLogout}>
                      <CgProfile style={{ fontSize: '1.5rem', marginRight: '10px' }} /> Logout
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </Navbar>

      {/* Show the logout success message */}
      {logoutMessage && (
        <div className="alert alert-success text-center" role="alert">
          {logoutMessage}
        </div>
      )}
    </>
  );
};

export default FacebookNavbar;
