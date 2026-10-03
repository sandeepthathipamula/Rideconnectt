import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
// import car from "../assets/car.jpeg";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }
    localStorage.setItem("mobile", mobile);

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobile,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        console.log(data.message);

        navigate("/otp", {
          replace: true
        });

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center overflow-hidden">

      <div className="w-[390px] h-[740px] bg-white rounded-[36px] overflow-hidden shadow-2xl flex flex-col">

        {/* Logo Section */}
        <div className="pt-8 flex flex-col items-center">

          <img
            src={logo}
            alt="RideConnect Logo"
            className="w-25 h-20 object-contain"
          />

          <h1 className="text-[42px] font-bold leading-none mt-2">
            Ride
            <span className="text-orange-500">
              Connect
            </span>
          </h1>

          <h2 className="text-[22px] font-bold mt-8">
            Welcome
          </h2>

          <p className="text-gray-500 text-center mt-3 px-10 text-[16px] leading-6">
            Let's get you moving
            <br />
            even without internet.
          </p>

        </div>

        {/* Form Section */}
        <div className="px-7 mt-8">

          <div className="h-14 border border-gray-200 rounded-xl flex items-center px-4 bg-white shadow-sm">

            <span className="text-gray-500 font-medium">
              +91
            </span>

            <input
              type="tel"
              maxLength="10"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="98765 43210"
              className="ml-3 outline-none w-full text-gray-700"
            />

          </div>

          <button
            onClick={sendOTP}
            disabled={loading}
            className="
              w-full
              h-12
              mt-4
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-green-900
              to-green-700
              shadow-lg
            "
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-6">

            <div className="flex-1 h-px bg-gray-200"></div>

            <span className="px-4 text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200"></div>

          </div>

          {/* Google Button */}
          <button className="w-full h-14 border border-gray-200 rounded-xl flex justify-center items-center gap-3 bg-white hover:bg-gray-50">

            <FcGoogle size={24} />

            <span className="font-medium">
              Continue with Google
            </span>

          </button>

        </div>

        {/* Bottom Illustration */}
        <div className="mt-auto relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-t from-orange-100 via-orange-50 to-white"></div>
          {/* 
          <img
            src={car}
            alt="RideConnect Car"
            className="
              relative
              z-10
              w-full
              h-[220px]
              object-cover
              object-bottom

            "
          /> */}

          <div className="relative z-10 text-center text-[13px] text-gray-600 font-medium py-4">
            Trusted | Secure | Always Accessible
          </div>

        </div>

      </div>

    </div>
  );
}