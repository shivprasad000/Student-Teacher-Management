import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginWithTokens, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authApi.loginWithPassword(username, password);
      // password login endpoint doesn't return is_admin directly;
      // treat any successful token issue as admin since only staff
      // accounts are expected to use this form.
      loginWithTokens(res.data.access, res.data.refresh, true);
      navigate("/students");
    } catch {
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError("");
    if (!credentialResponse.credential) return;
    try {
      const res = await authApi.loginWithGoogle(credentialResponse.credential);
      loginWithTokens(res.data.access, res.data.refresh, res.data.is_admin);
      navigate("/students");
    } catch {
      setError("Google sign-in failed.");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/students");
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Student & Teacher Management</h2>

      <form onSubmit={handlePasswordLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Login as Admin
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ margin: "16px 0", textAlign: "center" }}>— or —</div>

      <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-in failed.")} />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={handleGuest} style={{ padding: 8 }}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
