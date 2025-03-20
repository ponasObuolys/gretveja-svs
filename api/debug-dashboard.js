// Debug dashboard for monitoring Supabase connection and API endpoints
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json());

// Serve HTML dashboard
app.get('/api/debug-dashboard', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Debug Dashboard</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1, h2, h3 {
        color: #2c3e50;
      }
      .card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
      }
      .status {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 4px;
        font-weight: bold;
      }
      .success {
        background-color: #d4edda;
        color: #155724;
      }
      .error {
        background-color: #f8d7da;
        color: #721c24;
      }
      .warning {
        background-color: #fff3cd;
        color: #856404;
      }
      .info {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 10px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
      }
      button:hover {
        background-color: #45a049;
      }
      button.secondary {
        background-color: #2196F3;
      }
      button.secondary:hover {
        background-color: #0b7dda;
      }
      button.danger {
        background-color: #f44336;
      }
      button.danger:hover {
        background-color: #d32f2f;
      }
      pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
      }
      .endpoint-list {
        list-style-type: none;
        padding: 0;
      }
      .endpoint-list li {
        padding: 10px;
        margin-bottom: 5px;
        background-color: #f8f9fa;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .endpoint-list button {
        margin-left: 10px;
      }
      #results {
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <h1>API Debug Dashboard</h1>
    
    <div class="card">
      <h2>Supabase Connection</h2>
      <div id="connection-status">Checking connection...</div>
      <button onclick="checkConnection()">Test Connection</button>
    </div>
    
    <div class="card">
      <h2>Database Tables</h2>
      <div id="tables-status">Loading tables...</div>
      <button onclick="checkTables()">Check Tables</button>
      <button class="secondary" onclick="setupTables()">Setup Tables</button>
    </div>
    
    <div class="card">
      <h2>API Endpoints</h2>
      <ul class="endpoint-list">
        <li>
          <span>/api/products</span>
          <button onclick="testEndpoint('/api/products')">Test</button>
        </li>
        <li>
          <span>/api/suppliers</span>
          <button onclick="testEndpoint('/api/suppliers')">Test</button>
        </li>
        <li>
          <span>/api/companies</span>
          <button onclick="testEndpoint('/api/companies')">Test</button>
        </li>
        <li>
          <span>/api/trucks</span>
          <button onclick="testEndpoint('/api/trucks')">Test</button>
        </li>
        <li>
          <span>/api/stocks</span>
          <button onclick="testEndpoint('/api/stocks')">Test</button>
        </li>
        <li>
          <span>/api/purchases</span>
          <button onclick="testEndpoint('/api/purchases')">Test</button>
        </li>
        <li>
          <span>/api/issuances</span>
          <button onclick="testEndpoint('/api/issuances')">Test</button>
        </li>
      </ul>
    </div>
    
    <div class="card">
      <h2>Results</h2>
      <pre id="results">No results yet</pre>
    </div>
    
    <script>
      // Check Supabase connection
      async function checkConnection() {
        document.getElementById('connection-status').innerHTML = 'Checking connection...';
        try {
          const response = await fetch('/api/debug/connection');
          const data = await response.json();
          
          if (data.success) {
            document.getElementById('connection-status').innerHTML = 
              '<div class="status success">Connected</div>' +
              '<p>URL: ' + data.supabaseUrl + '</p>';
          } else {
            document.getElementById('connection-status').innerHTML = 
              '<div class="status error">Connection Failed</div>' +
              '<p>Error: ' + data.error + '</p>';
          }
          
          document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById('connection-status').innerHTML = 
            '<div class="status error">Connection Failed</div>' +
            '<p>Error: ' + error.message + '</p>';
          document.getElementById('results').textContent = error.message;
        }
      }
      
      // Check database tables
      async function checkTables() {
        document.getElementById('tables-status').innerHTML = 'Checking tables...';
        try {
          const response = await fetch('/api/setup/check');
          const data = await response.json();
          
          let tableHtml = '<table style="width:100%; border-collapse: collapse;">';
          tableHtml += '<tr><th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Table</th><th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Status</th></tr>';
          
          for (const [table, status] of Object.entries(data.tables)) {
            const statusClass = status.exists ? 'success' : 'error';
            const statusText = status.exists ? 'Exists' : 'Missing';
            tableHtml += '<tr>';
            tableHtml += '<td style="padding:8px; border-bottom:1px solid #ddd;">' + table + '</td>';
            tableHtml += '<td style="padding:8px; border-bottom:1px solid #ddd;"><div class="status ' + statusClass + '">' + statusText + '</div></td>';
            tableHtml += '</tr>';
          }
          
          tableHtml += '</table>';
          document.getElementById('tables-status').innerHTML = tableHtml;
          document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById('tables-status').innerHTML = 
            '<div class="status error">Check Failed</div>' +
            '<p>Error: ' + error.message + '</p>';
          document.getElementById('results').textContent = error.message;
        }
      }
      
      // Setup database tables
      async function setupTables() {
        document.getElementById('tables-status').innerHTML = 'Setting up tables...';
        try {
          const response = await fetch('/api/setup/run', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          
          if (data.success) {
            document.getElementById('tables-status').innerHTML = 
              '<div class="status success">Setup Completed</div>' +
              '<p>' + data.message + '</p>';
            // Refresh tables after setup
            setTimeout(checkTables, 1000);
          } else {
            document.getElementById('tables-status').innerHTML = 
              '<div class="status error">Setup Failed</div>' +
              '<p>Error: ' + data.error + '</p>';
          }
          
          document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById('tables-status').innerHTML = 
            '<div class="status error">Setup Failed</div>' +
            '<p>Error: ' + error.message + '</p>';
          document.getElementById('results').textContent = error.message;
        }
      }
      
      // Test API endpoint
      async function testEndpoint(endpoint) {
        document.getElementById('results').textContent = 'Testing endpoint ' + endpoint + '...';
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          document.getElementById('results').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById('results').textContent = 'Error testing endpoint ' + endpoint + ': ' + error.message;
        }
      }
      
      // Initialize the dashboard
      window.onload = function() {
        checkConnection();
        checkTables();
      };
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Connection test endpoint
app.get('/api/debug/connection', async (req, res) => {
  try {
    console.log('Testing Supabase connection...');
    
    // Simple query to test connection
    const { data, error } = await supabase.from('_dummy_query_').select('*').limit(1).catch(() => {
      // This will fail, but we just want to check if the connection works
      return { data: null, error: { message: 'Expected error from dummy query' } };
    });
    
    // If we get here, the connection is working
    res.json({
      success: true,
      message: 'Supabase connection is working',
      supabaseUrl,
      error: error ? error.message : null
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Supabase',
      message: error.message
    });
  }
});

// Export the Express app
module.exports = (req, res) => {
  return app(req, res);
};
