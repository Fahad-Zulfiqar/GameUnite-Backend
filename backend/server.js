import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

connectDB();

const __dirname = path.resolve();
const uploadsPath = path.join(__dirname, "uploads");

const app = express();

const allowedOrigins = [
  'https://game-unite-frontend.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.post("/api/create-checkout-session", async (req, res) => {
  const { products, orderId } = req.body;

  if (!products || !Array.isArray(products)) {
    console.error("Invalid request: Missing or invalid products data");
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://game-unite-frontend.vercel.app/order/${orderId}?payment_status=paid&order_id=${orderId}`,
      cancel_url: `https://game-unite-frontend.vercel.app/order/${orderId}?payment_status=cancelled&order_id=${orderId}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
