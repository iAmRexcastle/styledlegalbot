module.exports = {
<<<<<<< HEAD
  schema: './src/db/schema.ts', // Path to your schema definitions
  out: './drizzle',             // Output folder for generated files
  dialect: 'postgres',          // Specify the SQL dialect
  connectionString: process.env.DATABASE_URL,
};
=======
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  driver: "d1-http",
};
>>>>>>> 9c6f96b (Initial commit)
