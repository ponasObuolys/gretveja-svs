# Supabase Setup Guide

## Row Level Security (RLS) Issue

We've identified that the Supabase database has Row Level Security (RLS) enabled on the tables, which is preventing our application from inserting or updating data.

## Steps to Fix the Issue

### Option 1: Disable RLS for Development (Not Recommended for Production)

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to the "Table Editor" in the left sidebar
4. For each table (products, companies, trucks, etc.):
   - Click on the table name
   - Go to the "Policies" tab
   - Click "Enable RLS" to toggle it off (this will disable RLS)

### Option 2: Create RLS Policies (Recommended for Production)

1. Log in to your Supabase dashboard
2. Select your project
3. Go to the "Table Editor"
4. For each table:
   - Click on the table name
   - Go to the "Policies" tab
   - Click "Add Policy"
   - Create a policy that allows the operations you need:

#### Example Policy for Read Access:
- Policy name: "Allow read access for all users"
- Policy definition: `true`
- Operations: SELECT

#### Example Policy for Write Access:
- Policy name: "Allow insert access for authenticated users"
- Policy definition: `auth.role() = 'authenticated'`
- Operations: INSERT

#### Example Policy for Full Access During Development:
- Policy name: "Allow all access during development"
- Policy definition: `true`
- Operations: ALL

### Option 3: Use Supabase Authentication

If you want to keep RLS enabled (recommended for security), you should authenticate with Supabase before performing database operations:

```typescript
// In your login function
const { user, session, error } = await supabase.auth.signIn({
  email: 'user@example.com',
  password: 'password'
});

// After successful login, the client will automatically include the auth token in all requests
```

## Checking Table Structure

You may also need to ensure your table structure matches what your application expects:

1. In the Supabase dashboard, go to the "Table Editor"
2. Click on each table to view its columns
3. Make sure the column names match what your application is using:
   - For products: id, name, unit (no price column)
   - For companies: id, name, phone (no address column)
   - For trucks: id, plate_number, company_id

## Creating Missing Tables

If any tables are missing, you can create them in the Supabase dashboard:

1. Go to the "Table Editor"
2. Click "Create a new table"
3. Add the necessary columns
4. Set appropriate data types
5. Define primary keys and foreign keys

## Next Steps

After making these changes, try running the application again to see if the data appears correctly. If you're still experiencing issues, you may need to:

1. Check the Supabase logs for more detailed error information
2. Verify that your environment variables are correctly set
3. Ensure your application is using the correct column names when querying the database
