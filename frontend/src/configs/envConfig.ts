/**
 * Environment configuration for the frontend application
 * Centralizes all environment variable access and provides validation
 */

// Environment variables with validation and defaults
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not defined`);
    return "";
  }
  return value || defaultValue || "";
};

// Base configuration
export const env = {
  // API Configuration
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://localhost:8000"),

  // Application Configuration
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  APP_NAME: getEnvVar("VITE_APP_NAME", "FileUpload"),
  APP_VERSION: getEnvVar("VITE_APP_VERSION", "1.0.0"),

  // Security Configuration
  REDUX_PERSIST_SECRET_KEY: getEnvVar("VITE_REDUX_PERSIST_SECRET_KEY", "default-secret-key"),

  // Feature flags
  ENABLE_ANALYTICS: getEnvVar("VITE_ENABLE_ANALYTICS", "true") === "true",
  ENABLE_DEBUG: getEnvVar("VITE_ENABLE_DEBUG", "false") === "true",
  ENABLE_DEV_TOOLS: getEnvVar("VITE_ENABLE_DEV_TOOLS", "true") === "true",
} as const;

// API endpoint configuration
export const api = {
  // Base URL for all API calls
  baseUrl: env.API_BASE_URL,

  // Authentication endpoints
  auth: {
    login: `${env.API_BASE_URL}/api/auth/login`,
    register: `${env.API_BASE_URL}/api/auth/register`,
    logout: `${env.API_BASE_URL}/api/auth/logout`,
    users: `${env.API_BASE_URL}/api/auth/users`,
    profile: `${env.API_BASE_URL}/api/auth/profile`,
  },

  // File management endpoints
  files: {
    upload: `${env.API_BASE_URL}/api/files/upload`,
    list: `${env.API_BASE_URL}/api/files`,
    delete: `${env.API_BASE_URL}/api/files`,
    download: `${env.API_BASE_URL}/api/files`,
  },

  // Analytics endpoints
  analytics: {
    storage: `${env.API_BASE_URL}/api/analytics/storage`,
    files: `${env.API_BASE_URL}/api/analytics/files`,
  },

  // API Key management endpoints
  apiKeys: {
    list: `${env.API_BASE_URL}/api/apikeys`,
    create: `${env.API_BASE_URL}/api/apikeys`,
    delete: `${env.API_BASE_URL}/api/apikeys`,
  },

  // Health check
  health: `${env.API_BASE_URL}/health`,
};

// Helper function to get full API endpoint URL
export const getApiUrl = (endpoint: string): string => {
  return `${env.API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
};

// Environment validation (runs at startup)
const validateEnvironment = () => {
  const requiredVars = ["VITE_API_BASE_URL"];
  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
    console.warn("Using default values. Please check your .env file.");
  }

  // if (env.ENABLE_DEBUG) {
  //   console.log("Environment Configuration:", {
  //     API_BASE_URL: env.API_BASE_URL,
  //     NODE_ENV: env.NODE_ENV,
  //     APP_NAME: env.APP_NAME,
  //     APP_VERSION: env.APP_VERSION,
  //     ENABLE_ANALYTICS: env.ENABLE_ANALYTICS,
  //     ENABLE_DEV_TOOLS: env.ENABLE_DEV_TOOLS,
  //   });
  // }
};

// Run validation
validateEnvironment();