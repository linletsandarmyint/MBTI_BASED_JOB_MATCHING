import { useState, useContext } from "react";
import { loginUser } from "../api/authApi";
import { AuthContext } from "./AuthProvider";

import Modal from "./ui/Modal";

export default function LoginModal({ onClose, onOpenSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { refreshUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      console.log("Login success:", res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token saved:", localStorage.getItem("token"));
        // refresh global user state
        refreshUser && (await refreshUser());
      }
      alert("Login successful!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} className="w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">Welcome Back</h2>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

      <form onSubmit={handleLogin}>
        {/* Email */}
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />

        {/* Password */}
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-400 text-white py-2 rounded font-semibold hover:bg-teal-500 mb-4 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-sm text-teal-500">Don't have an account? <button onClick={() => { onClose && onClose(); onOpenSignup && onOpenSignup(); }} className="underline hover:text-teal-700">Sign up</button></p>
    </Modal>
  );
}
