export const validateEnv = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const nodeEnv = process.env.NODE_ENV;
  
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    console.error(`\n[FATAL] Invalid NODE_ENV. Must be 'development', 'production', or 'test'. Current: '${nodeEnv}'\n`);
    process.exit(1);
  }

  const requiredVariables = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'CLIENT_URL'
  ];

  const provider = (process.env.EMAIL_PROVIDER || 'SMTP').toUpperCase();
  if (isProd) {
    if (provider === 'RESEND') {
      requiredVariables.push('RESEND_API_KEY');
    } else {
      requiredVariables.push('EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS');
    }
  }

  const missingVariables = requiredVariables.filter((variable) => {
    const val = process.env[variable];
    return val === undefined || val === null || val.trim() === '';
  });

  const jwtSecret = process.env.JWT_SECRET || '';
  if (jwtSecret.length > 0 && jwtSecret.length < 32) {
    console.error('\n[FATAL] Server failed to start. JWT_SECRET must be at least 32 characters long.\n');
    process.exit(1);
  }

  if (isProd && process.env.CLIENT_URL) {
    const clientUrl = process.env.CLIENT_URL.toLowerCase();
    if (clientUrl.includes('localhost') || clientUrl.includes('127.0.0.1')) {
      console.error(`\n[FATAL] Server failed to start. CLIENT_URL cannot contain 'localhost' or '127.0.0.1' in production.\n`);
      process.exit(1);
    }
    if (!clientUrl.startsWith('https://')) {
      console.error(`\n[FATAL] Server failed to start. CLIENT_URL must begin with 'https://' in production.\n`);
      process.exit(1);
    }
    try {
      new URL(clientUrl);
    } catch (e) {
      console.error(`\n[FATAL] Server failed to start. CLIENT_URL is not a valid URL.\n`);
      process.exit(1);
    }
  }

  if (missingVariables.length > 0) {
    console.error(
      `\n[FATAL] Server failed to start. Missing required environment variables:\n` +
      missingVariables.map((v) => ` - ${v}`).join('\n') +
      `\n\nPlease ensure these are correctly set in your .env file or environment.\n`
    );
    process.exit(1);
  }
};
