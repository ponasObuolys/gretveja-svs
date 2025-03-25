import React, { useState } from 'react';
import { Container, Alert, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Admin.css';

// Importuojame reikiamus komponentus
import Vilkikai from './Vilkikai';
import Produktai from './Produktai';
import Tiekejai from './Tiekejai';
import Vairuotojai from './Vairuotojai';

/**
 * Administravimo puslapis
 * @returns {JSX.Element} Administravimo puslapio komponentas
 */
function Admin() {
  const { t } = useTranslation();
  // Būsenos kintamieji
  const [activeTab, setActiveTab] = useState('trucks');
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">{t('common.admin.title')}</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="admin-tabs"
        className="mb-4 admin-tabs"
        fill
      >
        {/* VILKIKŲ SKILTIS */}
        <Tab eventKey="trucks" title={t('common.menu.trucks')} tabClassName="admin-tab-item">
          <Vilkikai />
        </Tab>
        
        {/* PRODUKTŲ SKILTIS */}
        <Tab eventKey="products" title={t('common.menu.products')} tabClassName="admin-tab-item">
          <Produktai />
        </Tab>
        
        {/* TIEKĖJŲ SKILTIS */}
        <Tab eventKey="suppliers" title={t('common.menu.suppliers')} tabClassName="admin-tab-item">
          <Tiekejai />
        </Tab>
        
        {/* VAIRUOTOJŲ SKILTIS */}
        <Tab eventKey="drivers" title={t('common.menu.drivers')} tabClassName="admin-tab-item">
          <Vairuotojai />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin;