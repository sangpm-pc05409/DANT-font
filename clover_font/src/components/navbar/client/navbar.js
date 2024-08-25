import React from 'react';
import { Navbar, Nav, Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import { FaRegBell } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu } from "react-icons/io";


const FacebookNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="mr-2">
      <Container fluid>
        <Row className="w-100">
          <Col xs="auto" className="d-flex align-items-center">
            <Navbar.Brand href="/index">
              <img
               
                width="100"
                height="40"
                className="d-inline-block align-top"
                
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
            
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <Form inline className="w-50">
              <FormControl
                type="text"
                placeholder="Search"
                className="w-750"
                style={{ borderRadius: '20px'}}
              />
            </Form>
          </Col>

          <Col xs="auto" className="d-flex align-items-center justify-content-end">
            <Nav>
              <Nav.Link href="#menu" className="fs-4">
                <IoMdMenu style={{ fontSize: '1.75rem' }} />
              </Nav.Link>

              <Nav.Link href="#messages" className="fs-4">
                <FaRegCommentDots style={{ fontSize: '1.75rem' }} />
              </Nav.Link>

              <Nav.Link href="#notifications" className="fs-4">
                <FaRegBell style={{ fontSize: '1.75rem' }} />
              </Nav.Link>

              <Nav.Link href="/profile" className="fs-4">
                <CgProfile style={{ fontSize: '1.75rem' }} />
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default FacebookNavbar;
