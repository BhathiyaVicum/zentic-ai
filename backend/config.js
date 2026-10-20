const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  port: process.env.PORT || 3001,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};