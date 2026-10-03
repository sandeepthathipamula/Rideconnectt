import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.jpeg"; // Adjust the path to your logo image
const DriverLogin = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  // Set a default driver ID for testing
  const sendOTP = async () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/send-otp",
        {
          mobile,
        }
      );
localStorage.setItem("driverMobile", mobile);
      navigate("/driver-otp", {
        state: { mobile },
      });
    } catch (error) {
      console.log(error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">

      <div className="w-[390px] h-screen relative overflow-hidden bg-black">

        {/* Background */}

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#083D31]" />

        {/* Hero Content */}

        <div className="relative z-10 h-[60%] flex flex-col justify-center items-center px-8 text-center">

          <img
            src={logo}
            alt="RideConnect"
            className="w-24 h-24 object-contain"
          />

          <h1 className="text-white text-4xl font-bold mt-4">
            RideConnect
          </h1>

          <p className="text-white/80 text-sm mt-1 tracking-wide">
            DRIVER PARTNER
          </p>

          <h2 className="text-white text-3xl font-bold mt-8">
            Drive. Earn. Empower.
          </h2>

          <p className="text-white/80 mt-3 leading-6 text-sm">
            Be a part of a connected mobility network and
            start earning with every ride.
          </p>

        </div>

        {/* Login Card */}

        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-8 pb-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-center">
            Driver Login
          </h2>

          <p className="text-center text-gray-500 text-sm mt-2">
            Sign in using your mobile number
          </p>

          {/* Input */}

          <div className="mt-8">

            <div className="flex items-center h-14 border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden">

              <div className="px-4 font-medium border-r h-full flex items-center bg-white">
                +91
              </div>

              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="9876543210"
                className="flex-1 h-full px-4 bg-transparent outline-none"
              />

            </div>

          </div>

          {/* Button */}

          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full h-14 mt-6 rounded-2xl bg-[#0B5D46] text-white font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-[#084C3A] transition"
          >
            {loading ? (
              "Sending OTP..."
            ) : (
              <>
                Send OTP
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Register */}

          <div className="text-center mt-5">

            <button
              onClick={() =>
                navigate("/driver-register")
              }
              className="text-[#0B5D46] font-semibold"
            >
              New Driver? Register
            </button>

          </div>

          {/* Bottom Trust Line */}

          <div className="mt-8 text-center">

            <p className="text-xs text-gray-400">
              Trusted • Secure • SMS Enabled
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DriverLogin;