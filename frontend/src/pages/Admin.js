import React, { useState } from 'react';
import { Container, Alert, Tabs, Tab } from 'react-bootstrap';
import './Admin.css';

// Importuojame reikiamus komponentus
import Vilkikai from './Vilkikai';
import Produktai from './Produktai';
import Tiekejai from './Tiekejai';

/**
 * Administravimo puslapis
 * @returns {JSX.Element} Administravimo puslapio komponentas
 */
function Admin() {
  // Būsenos kintamieji
  const [activeTab, setActiveTab] = useState('trucks');
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">Administravimas</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="admin-tabs"
        className="mb-4 admin-tabs"
        fill
      >
        {/* VILKIKŲ SKILTIS */}
        <Tab eventKey="trucks" title="Vilkikai" tabClassName="admin-tab-item">
          <Vilkikai />
        </Tab>
        
        {/* PRODUKTŲ SKILTIS */}
        <Tab eventKey="products" title="Produktai" tabClassName="admin-tab-item">
          <Produktai />
        </Tab>
        
        {/* TIEKĖJŲ SKILTIS */}
        <Tab eventKey="suppliers" title="Tiekėjai" tabClassName="admin-tab-item">
          <Tiekejai />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin; 