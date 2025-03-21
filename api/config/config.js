/**
 * Application configuration
 */

module.exports = {
  // Environment variables
  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    supabaseUrl: process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co',
    supabaseKey: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro',
    jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret'
  },
  
  // CORS configuration
  cors: {
    origin: '*',
    credentials: true
  }
};
