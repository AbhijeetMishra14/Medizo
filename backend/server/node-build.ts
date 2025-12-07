import path from "path";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Backend-only mode: Just serve the API
// Frontend is served separately from the parent project

app.listen(port, () => {
  console.log(`🚀 Medizo Backend API server running on port ${port}`);
  console.log(`🔧 API endpoints: http://localhost:${port}/api`);
  console.log(`📱 Frontend runs separately on http://localhost:5173`);
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
