# Gretveja SVS API

This directory contains the API endpoints for the Gretveja SVS application. The API is built with Express.js and connects to a Supabase database.

## API Endpoints

The following API endpoints are available:

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get a single supplier by ID
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier
- `DELETE /api/suppliers/:id` - Delete a supplier

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get a single company by ID
- `POST /api/companies` - Create a new company
- `PUT /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Delete a company

### Trucks

- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/:id` - Get a single truck by ID
- `POST /api/trucks` - Create a new truck
- `PUT /api/trucks/:id` - Update a truck
- `DELETE /api/trucks/:id` - Delete a truck

### Stocks

- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:id` - Get a single stock by ID
- `POST /api/stocks` - Create a new stock
- `PUT /api/stocks/:id` - Update a stock
- `DELETE /api/stocks/:id` - Delete a stock

### Purchases

- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/:id` - Get a single purchase by ID
- `POST /api/purchases` - Create a new purchase
- `PUT /api/purchases/:id` - Update a purchase
- `DELETE /api/purchases/:id` - Delete a purchase

### Issuances

- `GET /api/issuances` - Get all issuances
- `GET /api/issuances/:id` - Get a single issuance by ID
- `POST /api/issuances` - Create a new issuance
- `PUT /api/issuances/:id` - Update an issuance
- `DELETE /api/issuances/:id` - Delete an issuance

## Debug Tools

The following debug tools are available:

### Debug Dashboard

- `GET /api/debug-dashboard` - Web-based dashboard for testing API endpoints and database connectivity

### Setup Endpoints

- `GET /api/setup/check` - Check if required tables exist in the database
- `POST /api/setup/run` - Create missing tables in the database

## Database Setup

The database tables are automatically created during deployment if they don't exist. You can also manually trigger the database setup using the setup endpoints.

## Environment Variables

The following environment variables are required:

- `SUPABASE_URL` - URL of the Supabase instance
- `SUPABASE_KEY` - Anon key for Supabase authentication

## Development

To run the API locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Run the setup script to create required tables:
   ```
   npm run setup
   ```

3. Start the API server:
   ```
   npm start
   ```

## Deployment

The API is deployed to Vercel. The `vercel.json` file in the root directory contains the configuration for the deployment.

## Troubleshooting

If you encounter issues with the API, you can use the debug dashboard to diagnose the problem. The dashboard allows you to:

1. Test the Supabase connection
2. Check if required tables exist
3. Create missing tables
4. Test individual API endpoints

Access the debug dashboard at `/api/debug-dashboard`.
