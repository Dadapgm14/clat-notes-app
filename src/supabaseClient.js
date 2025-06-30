// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujtkvflvwjaypojxchfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdGt2Zmx2d2pheXBvanhjaGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDg1ODIsImV4cCI6MjA2NjU4NDU4Mn0.IMb7H0f5Z6vP2fp96KyPEPSwqbcnM_7eSu3xCCuQRkg';
export const supabase = createClient(supabaseUrl, supabaseKey);
