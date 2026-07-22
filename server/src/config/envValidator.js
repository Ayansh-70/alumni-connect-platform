export const validateEnv = () => {
  const requiredVariables = [
    'JWT_SECRET',
    'MONGO_URI',
    'CLIENT_URL',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];

  const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

  if (missingVariables.length > 0) {
    console.error(
      `\n[FATAL] Server failed to start. Missing required environment variables:\n` +
      missingVariables.map((v) => ` - ${v}`).join('\n') +
      `\n\nPlease ensure these are correctly set in your .env file or environment.\n`
    );
    process.exit(1);
  }
};
