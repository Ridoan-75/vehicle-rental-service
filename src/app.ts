import express from "express";
import { initDB } from "./config/db";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
const app = express();

app.use(express.json());

initDB();


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Renteal Service System Server is Running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app