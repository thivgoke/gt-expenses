import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngchkajpvaktamemusoe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nY2hrYWpwdmFrdGFtZW11c29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzY5MTUsImV4cCI6MjA5MzM1MjkxNX0.Lu1Ay_BH20TaxMRbH15v_o7X0gtswx98gURwKLMAG1o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // This stops the browser from using the broken cached keys
  }
})
