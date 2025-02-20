module.exports = {
  schema: './src/db/schema.ts', // Path to your schema definitions
  out: './drizzle',             // Output folder for generated files
  dialect: 'postgres',          // Specify the SQL dialect
  connectionString: process.env.DATABASE_URL,
};
