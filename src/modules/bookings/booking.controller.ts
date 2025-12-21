import { Response } from "express";
import { bookingService } from "./booking.service";
import { AuthRequest } from "../../middleware/auth.middleware";


const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "customer_id, vehicle_id, rent_start_date and rent_end_date are required",
      });
    }

    const booking = await bookingService.createBooking({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId } = req.user!;
    const bookings = await bookingService.getBookings(role, userId);

    if (!bookings || bookings.length === 0) {
      const message =
        role === "admin"
          ? "No bookings found in the system"
          : "You have no previous bookings";
      return res.status(200).json({
        success: true,
        message,
        data: [],
      });
    }

    const message =
      role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId!, 10);
    const { status } = req.body;

    if (!status || !["cancelled", "returned"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid 'status' value required (cancelled or returned)",
      });
    }

    const { role } = req.user!;

    if (role === "customer" && status === "returned") {
      return res.status(403).json({
        success: false,
        message: "Customers cannot mark bookings as returned",
      });
    }

    if (role === "admin" && status === "cancelled") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot cancel bookings",
      });
    }

    const updated = await bookingService.updateBookingStatus(bookingId, status, role);
    
    const message = status === "returned" 
      ? "Booking marked as returned. Vehicle is now available"
      : "Booking cancelled successfully";

    res.status(200).json({
      success: true,
      message,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBookingStatus,
};