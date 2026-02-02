import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../../mbti/client/src/components/Navbar";
import LoginModal from "../../../mbti/client/src/components/LoginModal";
import SignupModal from "../../../mbti/client/src/components/SignupModal";
import Home from "../../../mbti/client/src/pages/Home";
import MbtiTestPage from "../../../mbti/client/src/pages/MbtiTestPage";
import Resultpage from "../../../mbti/client/src/pages/Resultpage";
import CompanyPortalPage from "../../../mbti/client/src/pages/CompanyPortalPage";
import Jobresult from "../../../mbti/client/src/pages/Jobresult";
import MyApplicationPage from "../../../mbti/client/src/pages/MyApplicationPage";
import AdminPortal from "../../../mbti/client/src/pages/AdminPortal";
import MbtiAnalytics from "./pages/MbtiAnalytics";
import SkillForm from "../../../mbti/client/src/components/SkillForm";

function App() {
  // State to control modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  return (
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
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      {/* Signup Modal */}
      {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
      {/* Skill Form Modal */}
      {showSkillForm && <SkillForm onClose={() => setShowSkillForm(false)} />}
    </div>
  );
}

export default App;
