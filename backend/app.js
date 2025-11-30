// app.js (ESM version)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import returnRoutes from "./routes/returns.js";
import accountRoutes from "./routes/accountRoutes.js";
import pesapalRoutes from "./routes/pesapalRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import couponRoutes from "./routes/couponRoutes.js"
import dealRoutes from "./routes/dealRoutes.js";

// ✅ Connect to DB
connectDB();

const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: [
       // deployed frontend
      "https://muzafey.online",
      "https://www.muzafey.online",
       // local dev
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Session Configuration for Passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_session_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// ✅ Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pesapal", pesapalRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Newly added discount and coupon modules
app.use("/api/discounts", discountRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/deals", dealRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Manwell Backend API is running...");
});

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
