// Application Configuration
export const APP_CONFIG = {
  name: 'Dates',
  version: '1.0.0',
  description: 'Find Your Perfect Match',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // URLs
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://dates.care',
  
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://zdkxonufigragkrhprnbd.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka3hvbnVmaWdhZ2tyaHBybmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NTQ4NzAsImV4cCI6MjA1MTUzMDg3MH0.FrJwPwjB6gqFQmMOlUUnPFqwAFLLYNO_vGoQztj5Rt8'
  },
  
  // Feature Flags
  features: {
    enablePayments: true,
    enableVideoChat: true,
    enableCryptoPayments: true,
    enableVerification: true,
    enableStaffPanel: true
  },
  
  // Legal Information
  legal: {
    companyName: 'Dates.care Inc.',
    jurisdiction: 'Ontario, Canada',
    address: '5515 Eglinton Ave, Etobicoke, ON M9C 5K5, Canada',
    phone: '+1 (424) 488-7950',
    email: {
      general: 'info@dates.care',
      support: 'supports@dates.care',
      legal: 'legal@dates.care',
      privacy: 'privacy@dates.care',
      disputes: 'disputes@dates.care'
    }
  }
};

// Default authentication configuration
export const AUTH_CONFIG = {
  redirectUrls: {
    signIn: '/app',
    signUp: '/onboarding',
    signOut: '/'
  },
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  enableEmailConfirmation: false,
  enablePasswordReset: true
};