

import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import MbtiDashboard from "../components/MbtiDashboard";
import MbtiTypes from "../components/MbtiTypes";
import Jobs from "../components/Jobs";
import Footer from "../components/Footer";
import GetStarted from "../components/GetStarted";
import HowCarrer from "../components/HowCarrer";
import PrivacyMatter from "../components/PrivacyMatter";
import PersonalityGroups from "../components/PersonalityGroups";
import WhoWeAre from "../components/WhoWeAre";
import FAQ from "../components/FAQ";

export default function Home() {
  

  return (
    <>
      

      
      <Hero />
      <GetStarted/>
      <HowCarrer />
      <PersonalityGroups />
      <PrivacyMatter />
      <WhoWeAre />
      <FAQ/>
      <Footer />                                                                                 
    </>
  );
}
