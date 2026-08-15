"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/vetsuppose");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="site">
        <div className="logo">
          <span className="logo-badge">V</span> Veterinary
        </div>
        <nav className="site">
          <a href="/">Back to shop</a>
        </nav>
      </header>
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0 }}>Admin login</h2>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="err">{error}</div>}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 6 }} disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </>
  );
}