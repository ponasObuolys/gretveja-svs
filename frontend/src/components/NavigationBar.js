import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './NavigationBar.css';

function NavigationBar() {
  const location = useLocation();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">Gretvėja-SVS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Pradžia
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/purchases" 
              active={location.pathname === '/purchases'}
            >
              Pirkimai
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/issuances" 
              active={location.pathname === '/issuances'}
            >
              Išdavimai
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stocks" 
              active={location.pathname === '/stocks'}
            >
              Atsargos
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              active={location.pathname === '/admin'}
            >
              Administravimas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar; 