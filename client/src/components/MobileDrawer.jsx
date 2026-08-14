import React from "react";
import { Link } from "react-router-dom";

export default function MobileDrawer({ open, onClose, items = [], onLogin, onSignup, user, onLogout, onSkillClick }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-64 bg-white h-full shadow p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-xl text-teal-600">TypePath</div>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <nav className="flex flex-col gap-2">
          {items.map((it) => (
            <Link key={it.to} to={it.to} onClick={onClose} className="px-2 py-2 rounded hover:bg-gray-100">
              {it.label}
            </Link>
          ))}

          <button onClick={() => { onSkillClick && onSkillClick(); onClose && onClose(); }} className="text-left px-2 py-2 rounded hover:bg-gray-100">Skill Set</button>

          {!user ? (
            <>
              <button onClick={() => { onLogin && onLogin(); onClose && onClose(); }} className="text-left px-2 py-2 rounded hover:bg-gray-100">Log In</button>
              <button onClick={() => { onSignup && onSignup(); onClose && onClose(); }} className="text-left px-2 py-2 rounded hover:bg-gray-100">Sign Up</button>
            </>
          ) : (
            <>
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center gap-3">
                  <img src={user.avatar || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.email}`} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{user.name || user.email}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                </div>
                <button onClick={() => { onLogout && onLogout(); onClose && onClose(); }} className="mt-3 text-left px-2 py-2 rounded hover:bg-gray-100">Logout</button>
              </div>
            </>
          )}
        </nav>
      </div>
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}
