import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import getNavItems from "./RoleNavItems";
import MobileDrawer from "./MobileDrawer";
import Button from "./ui/Button";

export default function Navbar({ onSkillClick, onLoginClick, onSignupClick }) {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <Link to="/" className="font-bold text-xl text-teal-600">
            TypePath
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-600 items-center">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-teal-600">
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => onSkillClick && onSkillClick()}
            className="border px-3 py-1 rounded hover:text-teal-600"
          >
            Skill Set
          </button>

          {/* Auth area */}
          {!user ? (
            <>
              <Button onClick={onLoginClick} variant="primary" size="md">
                Log In
              </Button>
              <button onClick={onSignupClick} className="border px-4 py-2 rounded">
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative">
              <img
                onClick={() => setShowMenu(!showMenu)}
                src={
                  user.avatar || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.email}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border cursor-pointer"
              />

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow min-w-[150px]">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
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
        <button onClick={() => setOpen(true)} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={navItems}
        onLogin={onLoginClick}
        onSignup={onSignupClick}
        user={user}
        onLogout={handleLogout}
        onSkillClick={onSkillClick}
      />
    </nav>
  );
}
