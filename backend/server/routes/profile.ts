import express, { RequestHandler } from "express";
import { UserModel } from "../models/User";
import { requireUser } from "../middleware/auth"; // your existing auth middleware
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads", "users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Simple file upload handler for base64 or buffer
const saveUploadedFile = async (file: any): Promise<string> => {
  if (!file) return "";

  try {
    const ext = path.extname(file.originalname || file.name || ".jpg");
    const fileName = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } else if (file.path) {
      fs.copyFileSync(file.path, filePath);
    } else if (typeof file === "string") {
      // Handle base64 string
      const base64Data = file.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(filePath, buffer);
    }

    return `/uploads/users/${fileName}`;
  } catch (err) {
    console.error("File save error:", err);
    return "";
  }
};

// Get current user profile
router.get("/", requireUser as RequestHandler, async (req, res) => {
  try {
    const user = (req as any).user;
    const userId = user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userData = await UserModel.findById(userId).select("-passwordHash").lean();
    if (!userData) return res.status(404).json({ message: "User not found" });
    res.json(userData);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update user profile (name, phone, email, image)
router.put("/", requireUser as RequestHandler, async (req, res) => {
  try {
    const user = (req as any).user;
    const userId = user?.sub;
    const { name, phone, email } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;

    // Handle image upload if file is present
    if ((req as any).file) {
      const imageUrl = await saveUploadedFile((req as any).file);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-passwordHash").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
        role: updatedUser.role,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

// Update endpoint that accepts multipart form data
router.put("/update", requireUser as RequestHandler, async (req, res) => {
  try {
    const authUser = (req as any).user;
    const userId = authUser?.sub;
    
    // Handle both JSON and FormData
    const name = req.body?.name as string;
    const phone = req.body?.phone as string;
    const email = req.body?.email as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;

    // Handle image upload if file is present
    if ((req as any).file) {
      const imageUrl = await saveUploadedFile((req as any).file);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-passwordHash").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
        role: updatedUser.role,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

// Add new address
router.post("/address", requireUser as RequestHandler, async (req, res) => {
  const { label, line1, line2, city, state, zip, country } = req.body;
  const authUser = (req as any).user;
  const userId = authUser?.sub;
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.addresses.push({ label, line1, line2, city, state, zip, country });
  await user.save();
  res.json(user.addresses);
});

// Update an existing address
router.put("/address/:index", requireUser as RequestHandler, async (req, res) => {
  const index = Number(req.params.index);
  const { label, line1, line2, city, state, zip, country } = req.body;

  const authUser = (req as any).user;
  const userId = authUser?.sub;
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.addresses[index]) return res.status(400).json({ message: "Address not found" });

  user.addresses[index] = { label, line1, line2, city, state, zip, country };
  await user.save();
  res.json(user.addresses);
});

export default router;
