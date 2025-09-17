-- Add quantity column to bookings
ALTER TABLE "Booking" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
