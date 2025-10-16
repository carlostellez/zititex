// Environment variables type definitions for static frontend

declare global {
  interface Window {
    ENV: {
      // Environment
      NODE_ENV: string;
      [key: string]: string; // Allow dynamic access
    };
  }
}

export {}; 