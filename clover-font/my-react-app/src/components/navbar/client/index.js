// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import './Navbar.css';

function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">
        <img src="/assets/logo.png" alt="Facebook Logo" className="navbar-logo" />
      </Navbar.Brand>
      <Form inline>
        <FormControl type="text" placeholder="Tìm kiếm trên Facebook" className="mr-sm-2" />
      </Form>
      <Nav className="ml-auto">
        <Nav.Link href="#home"><i className="fas fa-home"></i></Nav.Link>
        <Nav.Link href="#link"><i className="fas fa-users"></i></Nav.Link>
        <Nav.Link href="#link"><i className="fas fa-bell"></i></Nav.Link>
        <Nav.Link href="#link"><i className="fas fa-user"></i></Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
