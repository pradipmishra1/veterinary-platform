export default function EmergencyBanner({ phone }: { phone: string }) {
  return (
    <div
      style={{
        background: "var(--danger)",
        color: "#fff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 600
      }}
    >
      🚨 Emergency? Call us now:{" "}
      <a href={`tel:${phone}`} style={{ color: "#fff", textDecoration: "underline" }}>
        {phone}
      </a>
    </div>
  );
}