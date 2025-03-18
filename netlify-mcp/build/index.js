const { createServer } = require('http');
const { parse } = require('url');

// Access token from environment variable
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;

// Base URL for Netlify API
const NETLIFY_API_BASE_URL = 'https://api.netlify.com/api/v1';

/**
 * Create a new Netlify site from a GitHub repository
 * @param {Object} args - Arguments for creating a site
 * @param {string} args.name - Name for the new site
 * @param {string} args.repo - GitHub repository (format: owner/repo)
 * @param {string} args.branch - Branch to deploy from
 * @param {string} args.buildCommand - Build command to run
 * @param {string} args.publishDir - Directory containing the built files
 * @returns {Promise<Object>} - Created site object
 */
async function createSiteFromGitHub(args) {
  const { name, repo, branch, buildCommand, publishDir } = args;
  
  try {
    const response = await fetch(`${NETLIFY_API_BASE_URL}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        name,
        repo: {
          provider: 'github',
          repo,
          branch,
          cmd: buildCommand,
          dir: publishDir
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create site: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
}

/**
 * List all Netlify sites you have access to
 * @param {Object} args - Arguments for listing sites
 * @param {string} [args.filter] - Optional filter for sites ('all', 'owner', 'guest')
 * @returns {Promise<Array>} - List of sites
 */
async function listSites(args = {}) {
  const { filter = 'all' } = args;
  
  try {
    const response = await fetch(`${NETLIFY_API_BASE_URL}/sites?filter=${filter}`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to list sites: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error listing sites:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific site
 * @param {Object} args - Arguments for getting a site
 * @param {string} args.siteId - ID of the site to retrieve
 * @returns {Promise<Object>} - Site object
 */
async function getSite(args) {
  const { siteId } = args;
  
  try {
    const response = await fetch(`${NETLIFY_API_BASE_URL}/sites/${siteId}`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get site: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting site:', error);
    throw error;
  }
}

/**
 * Delete a Netlify site
 * @param {Object} args - Arguments for deleting a site
 * @param {string} args.siteId - ID of the site to delete
 * @returns {Promise<Object>} - Result of deletion
 */
async function deleteSite(args) {
  const { siteId } = args;
  
  try {
    const response = await fetch(`${NETLIFY_API_BASE_URL}/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete site: ${response.statusText}`);
    }
    
    return { success: true, message: 'Site deleted successfully' };
  } catch (error) {
    console.error('Error deleting site:', error);
    throw error;
  }
}

// Map of available functions
const functions = {
  createSiteFromGitHub,
  listSites,
  getSite,
  deleteSite
};

// Create HTTP server to handle MCP requests
const server = createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  // Parse request URL
  const { pathname } = parse(req.url, true);
  
  // Extract function name from pathname
  const functionName = pathname.slice(1);
  
  // Check if function exists
  if (!functions[functionName]) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Function '${functionName}' not found` }));
    return;
  }
  
  // Read request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      // Parse request body
      const { args } = JSON.parse(body);
      
      // Call function with args
      const result = await functions[functionName](args);
      
      // Send response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result }));
    } catch (error) {
      // Send error response
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Netlify MCP server running on port ${PORT}`);
});
