import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import './NavigationBar.css';

function NavigationBar() {
  const location = useLocation();
  const { t } = useTranslation();
  
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
              {t('common.menu.home')}
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/purchases" 
              active={location.pathname === '/purchases'}
            >
              {t('common.tables.purchases')}
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/issuances" 
              active={location.pathname === '/issuances'}
            >
              {t('common.tables.issuances')}
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stocks" 
              active={location.pathname === '/stocks'}
            >
              {t('common.tables.stocks')}
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              active={location.pathname === '/admin'}
            >
              {t('common.menu.admin')}
            </Nav.Link>
          </Nav>
          <LanguageSwitcher />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar; 