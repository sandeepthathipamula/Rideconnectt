 import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTPVerification = () => {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("mobile") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputs = useRef([]);

  useEffect(() => {
    if (!mobile) {
      navigate("/");
    }

    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/verify-otp",
        {
          mobile,
          otp: enteredOTP,
        }
      );

      if (response.data.success) {
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/send-otp",
        {
          mobile,
        }
      );

      if (response.data.success) {
        setTimer(30);
        alert("OTP Sent Successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (otp.join("").length === 6) {
      verifyOTP();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-6">
      <div className="w-[340px] min-h-[700px] bg-white rounded-[32px] shadow-xl px-5 pt-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <MessageSquare
              size={32}
              className="text-[#FF8A00]"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Enter OTP
        </h1>

        <p className="text-center text-gray-500 mt-3">
          We've sent a 6-digit code to
        </p>

        <p className="text-center font-semibold text-gray-900 mt-1">
          +91 {mobile}
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between mt-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-[#FF8A00]"
            />
          ))}
        </div>

        {/* Resend Timer */}
        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in 00:
              {String(timer).padStart(2, "0")}
            </p>
          ) : (
            <button
              onClick={resendOTP}
              className="text-[#0F6B4B] font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyOTP}
          disabled={loading}
          className="w-full mt-8 bg-[#0F6B4B] text-white py-4 rounded-xl font-semibold shadow-md"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
};

export default OTPVerification;