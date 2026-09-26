-- Allow clients to request an appointment before the clinic configures a service catalog.
-- Existing service-linked bookings remain linked.
ALTER TABLE "Booking" ALTER COLUMN "serviceId" DROP NOT NULL;
