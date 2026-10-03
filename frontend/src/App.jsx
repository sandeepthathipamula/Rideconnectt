 import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import OTPVerification from "./pages/OTPVerification";
import HomePage from "./pages/Home";
import SearchingDriver from "./pages/SearchingDriver";  
import DriverLogin from "./pages/DriverLogin";
import DriverOTP from "./pages/DriverOTP";  // Import the DriverOTP component
import Driver from "./pages/Driver";  // Import the Driver component
import DriverAssign from "./pages/DriverAssigned";  // Import the DriverDashboard component
import DriverProfile from "./pages/DriverProfile";  // Import the DriverProfile component
import DriverNavigation from "./pages/DriverNavigation";  // Import the DriverNavigation component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. The Splash Screen loads first at the root path "/" */}
        <Route path="/" element={<SplashScreen />} />
        
        {/* 2. The Login Screen is the destination path "/login" */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/searching-driver" element={<SearchingDriver />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-otp" element={<DriverOTP />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/driver-assigned" element={<DriverAssign />} />
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/driver-navigation" element={<DriverNavigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
