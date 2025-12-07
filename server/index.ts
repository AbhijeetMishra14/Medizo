// server.ts
import { fileURLToPath } from 'url';
import path from "path";
import dotenv from "dotenv";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import express from "express";
import cors from "cors";

import { handleDemo } from "./routes/demo";
import { connectMongo } from "./config/db";
import { productsRouter } from "./routes/products";
import { adminAuthRouter } from "./routes/admin-auth";
import { authRouter } from "./routes/auth";
import { seedRouter } from "./routes/seed";
import { reviewsRouter } from "./routes/reviews";
import ordersRouter from "./routes/orders";
import profileRouter from "./routes/profile";

import { ensureSeed } from "./services/productService";
import { isMongoConnected } from "./config/db";

// Custom middleware to parse FormData
const parseFormData = express.text({ type: 'application/octet-stream' });

// Track MongoDB initialization
let mongoInitialized = false;
let mongoInitPromise = Promise.resolve();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  
  // Custom middleware to parse FormData from profile updates
  app.use((req, res, next) => {
    if (req.is('multipart/form-data') || (req.headers['content-type'] && req.headers['content-type'].includes('multipart'))) {
      // Parse multipart form data manually
      const boundary = req.headers['content-type']?.split('boundary=')[1];
      if (!boundary) return next();
      
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          // Simple parsing of multipart form data
          const parts = body.split(`--${boundary}`);
          req.body = {};
          
          parts.forEach((part) => {
            if (!part || part === '--') return;
            
            const [header, ...content] = part.split('\r\n\r\n');
            const contentStr = content.join('\r\n\r\n').replace(/\r\n--$/, '').trim();
            
            const nameMatch = header.match(/name="([^"]+)"/);
            if (nameMatch) {
              const fieldName = nameMatch[1];
              const filenameMatch = header.match(/filename="([^"]+)"/);
              
              if (filenameMatch) {
                // Handle file upload
                (req as any).file = {
                  fieldname: fieldName,
                  originalname: filenameMatch[1],
                  buffer: Buffer.from(contentStr, 'binary'),
                  size: Buffer.byteLength(contentStr),
                };
              } else {
                // Handle regular field
                (req.body as any)[fieldName] = contentStr;
              }
            }
          });
          
          next();
        } catch (err) {
          console.error('FormData parsing error:', err);
          next();
        }
      });
    } else {
      next();
    }
  });
  
  // Serve static files for uploads
  app.use("/uploads", express.static("public/uploads"));


  // Set security headers for OAuth
  app.use((req, res, next) => {
    res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
  });

  // Health & demo endpoints
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // API routes
  app.use("/api/products", productsRouter);           // Public products
  app.use("/api/admin", adminAuthRouter);            // Admin login, verify, me
  app.use("/api/admin/products", productsRouter);    // Admin products CRUD
  app.use("/api/auth", authRouter);                  // User auth
  app.use("/api/profile", profileRouter);            // User profile
  app.use("/api/reviews", reviewsRouter);            // Reviews
  app.use("/api/orders", ordersRouter);              // Orders
  app.use("/api/seed", seedRouter);                  // Seed data

  // Initialize DB connection and seed if needed
  mongoInitPromise = connectMongo()
    .then(async () => {
      console.log("✅ MongoDB connected.");
      await ensureSeed();
      mongoInitialized = true;
    })
    .catch(async (err) => {
      console.warn("⚠️  MongoDB connection error, using in-memory fallback:", err instanceof Error ? err.message : err);
      // Still run seed for in-memory data
      await ensureSeed();
      mongoInitialized = true;
    });

  return app;
}
