 import React, { useRef, useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DriverOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);

  const mobile = localStorage.getItem("driverMobile") || "";

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    try {
      // Verify OTP API

      navigate("/driver-dashboard");
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  const handleResendOTP = async () => {
    try {
      // Resend OTP API

      setTimeLeft(60);

      alert("OTP Sent Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-[340px]">

        <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100">

          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-800 mt-6">
            Verify OTP
          </h1>

          <p className="text-center text-slate-500 text-sm mt-3 leading-relaxed">
            Enter the verification code sent to
          </p>

          <p className="text-center font-semibold text-slate-800 mt-2">
            +91 {mobile}
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                className="
                  w-12
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  text-center
                  text-xl
                  font-bold
                  outline-none
                  transition-all
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            ))}
          </div>

          <div className="text-center mt-8">
            {timeLeft > 0 ? (
              <p className="text-slate-500 text-sm">
                Resend OTP in
                <span className="font-semibold text-slate-700 ml-1">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={handleVerifyOtp}
            className="
              mt-8
              w-full
              h-14
              rounded-full
              text-white
              text-lg
              font-semibold
              bg-gradient-to-r
              from-blue-700
              via-blue-600
              to-cyan-500
              shadow-[0_10px_25px_rgba(37,99,235,0.30)]
              hover:scale-[1.02]
              transition-all
            "
          >
            Verify OTP
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button
            onClick={() => navigate("/driver-login")}
            className="w-full text-blue-600 font-medium"
          >
            Change Phone Number
          </button>

        </div>
      </div>
    </div>
  );
};

export default DriverOtp;