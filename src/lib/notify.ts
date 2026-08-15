type BookingAlertData = {
  ownerName: string;
  phone: string;
  petName: string;
  serviceName: string;
  preferredDate: string;
  notes?: string | null;
};

export async function sendBookingAlert(data: BookingAlertData) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.ADMIN_WHATSAPP_TO;

  if (!sid || !token || !from || !to) {
    console.log("Twilio not configured yet — skipping WhatsApp alert.");
    return;
  }

  try {
    const twilio = (await import("twilio")).default;
    const client = twilio(sid, token);
    await client.messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      body: `New appointment request\nOwner: ${data.ownerName}\nPhone: ${data.phone}\nPet: ${data.petName}\nService: ${data.serviceName}\nDate: ${data.preferredDate}\nNotes: ${data.notes || "-"}`
    });
  } catch (err) {
    console.error("WhatsApp alert failed:", err);
  }
}