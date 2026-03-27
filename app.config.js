// app.config.js
// Dynamic config that exposes environment variables to the application
// via expo-constants. Secret keys are injected at build time from .env.

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      KORAPAY_SECRET_KEY: process.env.KORAPAY_SECRET_KEY,
      KORAPAY_PUBLIC_KEY: process.env.KORAPAY_PUBLIC_KEY,
    },
  };
};
