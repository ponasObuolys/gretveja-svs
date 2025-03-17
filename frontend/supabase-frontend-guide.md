# Frontend Adaptation for Supabase

This guide explains the changes made to adapt the frontend application to work with the Supabase database structure.

## Key Changes

### 1. Data Transformation Layer

A data transformation layer has been implemented to handle the differences between the frontend and backend data structures:

- **Snake Case vs Camel Case**: Supabase uses snake_case for field names (e.g., `name_en`), while the frontend uses camelCase (e.g., `nameEn`).
- **Missing Fields**: The `code` field that was previously used in the frontend is not present in the Supabase schema.

### 2. ProductModel.js

The ProductModel class has been updated to:

- Transform data from snake_case to camelCase when receiving from the backend
- Transform data from camelCase to snake_case when sending to the backend
- Add a placeholder for the `code` field using the product's ID to maintain compatibility with existing code

### 3. Form Components

The ProductForm component has been updated to:

- Remove the `code` field from the form since it's not stored in Supabase

### 4. List Components

The ProductList component has been updated to:

- Remove the `code` column from the table display

### 5. Controllers

The ProductController has been updated to:

- Modify the filtering logic to not depend on the `code` field
- Add null checks for optional fields

### 6. Utility Functions

A new utility file `dataTransformers.js` has been created with functions to:

- Transform snake_case object keys to camelCase
- Transform camelCase object keys to snake_case
- Provide specific transformers for product data

## How It Works

1. When data is fetched from the backend, it's transformed to the format expected by the frontend
2. When data is sent to the backend, it's transformed to the format expected by Supabase
3. The `code` field is simulated using the product's ID to maintain compatibility with existing code

## Next Steps

1. **Test the Application**: Verify that data is being displayed correctly and that CRUD operations work as expected
2. **Review RLS Policies**: Ensure that the appropriate Row Level Security policies are in place to allow the application to insert and update data
3. **Migrate Data**: If needed, use the migration script to populate the Supabase database with initial sample data
