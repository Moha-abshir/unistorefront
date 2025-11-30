import dotenv from "dotenv";
import app from "./app.js";
import { runMigrations } from "./utils/migrations.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Run database migrations
  try {
    await runMigrations();
  } catch (error) {
    console.error('⚠️ Migration error (non-fatal):', error.message);
  }
});
