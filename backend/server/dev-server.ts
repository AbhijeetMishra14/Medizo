import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Start server (dev mode - frontend runs separately on 5173)
app.listen(port, () => {
  console.log(`🚀 Backend API server running on http://localhost:${port}`);
  console.log(`🔧 API endpoints: http://localhost:${port}/api`);
  console.log(`📱 Frontend will run separately on http://localhost:5173`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
