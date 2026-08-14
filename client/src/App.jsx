import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Home from "./pages/Home";
import MbtiTestPage from "./pages/MbtiTestPage";
import Resultpage from "./pages/Resultpage";
import CompanyPortalPage from "./pages/CompanyPortalPage";
import Jobresult from "./pages/Jobresult";
import MyApplicationPage from "./pages/MyApplicationPage";
import AdminPortal from "./pages/AdminPortal";
import MbtiAnalytics from "./pages/MbtiAnalytics";
import SkillForm from "./components/SkillForm";

function App() {
  // State to control modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  return (
    <AuthProvider>
      <div className="bg-gray-50 relative min-h-screen">
        {/* Navbar: pass function to open login modal */}
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          onSignupClick={() => setIsSignupOpen(true)}
          onSkillClick={() => setShowSkillForm(true)}
        />

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mbti-test" element={<MbtiTestPage />} />
          <Route path="/result" element={<Resultpage />} />
          <Route path="/companyportal" element={<CompanyPortalPage />} />
          <Route path="/jobresult" element={<Jobresult />} />
          <Route path="/myapplication" element={<MyApplicationPage />} />
          <Route path="/analytics" element={<MbtiAnalytics />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>

        {/* Login Modal */}
        {isLoginOpen && (
          <LoginModal
            onClose={() => setIsLoginOpen(false)}
            onOpenSignup={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}
          />
        )}
        {/* Signup Modal */}
        {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
        {/* Skill Form Modal */}
        {showSkillForm && <SkillForm onClose={() => setShowSkillForm(false)} />}
      </div>
    </AuthProvider>
  );
}

export default App;
