import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ onSkillClick, onLoginClick, onSignupClick }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-xl text-teal-600">TypePath</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-600 items-center">
          <Link to="/" className="hover:text-teal-600">
            Home
          </Link>
          <Link to="/mbti-test" className="hover:text-teal-600">
            MBTI Test
          </Link>
          <Link to="/result" className="hover:text-teal-600">
            My results
          </Link>
          <Link to="/jobresult" className="hover:text-teal-600">
            Jobs
          </Link>
          <Link to="/analytics" className="hover:text-teal-600">
            Graph
          </Link>
          <Link to="/companyportal" className="hover:text-teal-600">
            Company Portal
          </Link>
          <Link to="/admin" className="hover:text-teal-600">
            Admin
          </Link>
          <button
            onClick={() => onSkillClick && onSkillClick()}
            className="border px-3 py-1 rounded hover:text-teal-600"
          >
            Skill Set
          </button>

          {/* ===== AUTH BUTTONS ===== */}
          {!user ? (
            <>
              <button
                onClick={onLoginClick}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Log In
              </button>
              <button
                onClick={onSignupClick}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative">
              {/* Avatar */}
              <img
                onClick={() => setShowMenu(!showMenu)}
                src={
                  user.avatar ||
                  `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.email}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border cursor-pointer"
              />

              {/* Logout dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow">
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <Link to="/" className="block px-6 py-3 hover:bg-gray-100">
            Home
          </Link>
          <Link to="/mbti-test" className="block px-6 py-3 hover:bg-gray-100">
            MBTI Test
          </Link>
          <Link to="/jobresult" className="block px-6 py-3 hover:bg-gray-100">
            Jobs
          </Link>
          <Link to="/companyportal" className="block px-6 py-3 hover:bg-gray-100">
            Company Portal
          </Link>

          {!user ? (
            <>
              <button
                onClick={onLoginClick}
                className="w-full text-left px-6 py-3 hover:bg-gray-100"
              >
                Log In
              </button>
              <button
                onClick={onSignupClick}
                className="w-full text-left px-6 py-3 hover:bg-gray-100"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full text-left px-6 py-3 hover:bg-gray-100"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
