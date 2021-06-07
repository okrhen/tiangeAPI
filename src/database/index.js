const {createClient} = require('@supabase/supabase-js')

/** 
move this to .env file later
*/ 
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

  
module.exports = supabase;