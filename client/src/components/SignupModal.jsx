import { useState } from "react";
import { registerUser } from "../api/authApi";

export default function SignupModal({ onClose }) {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role,
        companyName,
      });
      console.log("Signup response:", res.data);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          Create Your Account
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-3">{success}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <div>
            <label className="block text-sm mb-1">I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="company">Company</option>
            </select>
          </div>

          {role === "company" && (
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 rounded font-semibold hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-3 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={onClose} // close signup to go back to login
            className="text-teal-500 underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
