export function validateEnv(): void {
  const requiredServerEnv = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
  ];

  const requiredClientEnv = [
    'NEXT_PUBLIC_POSTHOG_KEY',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missingServerEnv = requiredServerEnv.filter(
    (key) => !process.env[key]
  );

  const missingClientEnv = requiredClientEnv.filter(
    (key) => !process.env[key]
  );

  const allMissing = [...missingServerEnv, ...missingClientEnv];

  if (allMissing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${allMissing.join(', ')}`
    );
  }
}
