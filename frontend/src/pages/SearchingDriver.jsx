 import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  MapPin,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SearchingDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rideId = location.state?.rideId;

  const [step, setStep] = useState(1);
  const [driversFound, setDriversFound] = useState(1);

  useEffect(() => {
    if (!rideId) {
      navigate("/home");
    }
  }, [rideId, navigate]);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 4000);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const driverTimer = setInterval(() => {
      setDriversFound(Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(driverTimer);
  }, []);

  useEffect(() => {
    if (!rideId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/ride-status/${rideId}`
        );

        if (
          response.data.success &&
          response.data.status === "ACCEPTED"
        ) {
          clearInterval(interval);

          navigate("/driver-assigned", {
            state: {
              rideId,
              driverId: response.data.driver_id,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rideId, navigate]);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-[340px] h-screen overflow-hidden relative bg-[#081120]">

        {/* TOP BAR */}

        <div className="absolute top-5 left-4 right-4 flex justify-between z-50">

          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white"
          >
            <MoreHorizontal size={18} />
          </button>

        </div>

        {/* MAP AREA */}

        <div className="absolute inset-0">

          {/* ROAD LINES */}

          <div className="absolute top-20 left-[-50px] w-[500px] h-[2px] bg-white/5 rotate-12" />
          <div className="absolute top-52 left-[-50px] w-[500px] h-[2px] bg-white/5 -rotate-6" />
          <div className="absolute top-96 left-[-50px] w-[500px] h-[2px] bg-white/5 rotate-[18deg]" />

          <div className="absolute left-16 top-0 w-[2px] h-full bg-white/5" />
          <div className="absolute left-40 top-0 w-[2px] h-full bg-white/5" />
          <div className="absolute left-72 top-0 w-[2px] h-full bg-white/5" />

          {/* DRIVER MARKERS */}

          <div className="absolute top-24 left-10">
            <div className="w-10 h-10 rounded-full bg-[#0F6B4B] flex items-center justify-center shadow-xl animate-pulse">
              🚗
            </div>
          </div>

          <div className="absolute top-44 right-8">
            <div className="w-10 h-10 rounded-full bg-[#FF8A00] flex items-center justify-center shadow-xl animate-bounce">
              🚕
            </div>
          </div>

          <div className="absolute bottom-[360px] left-10">
            <div className="w-10 h-10 rounded-full bg-[#0F6B4B] flex items-center justify-center shadow-xl animate-pulse">
              🚗
            </div>
          </div>

          <div className="absolute bottom-[300px] right-10">
            <div className="w-10 h-10 rounded-full bg-[#FF8A00] flex items-center justify-center shadow-xl animate-bounce">
              🚕
            </div>
          </div>

          {/* USER GPS */}

          <div className="absolute top-[220px] left-1/2 -translate-x-1/2">

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-[#0F6B4B]/30 animate-ping scale-[5]" />

              <div className="absolute inset-0 rounded-full border border-[#0F6B4B] scale-[3]" />

              <div className="absolute inset-0 rounded-full border border-[#0F6B4B]/40 scale-[4]" />

              <div className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center">

                <MapPin
                  size={28}
                  className="text-[#0F6B4B]"
                />

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SHEET */}

        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/10 rounded-t-[35px] px-5 pt-6 pb-8">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-white text-2xl font-bold">
                Finding Driver
              </h2>

              <p className="text-white/70 text-sm mt-1">
                Searching nearby RideConnect drivers
              </p>
            </div>

            <div className="bg-[#FF8A00] px-3 py-1 rounded-full">
              <span className="text-white text-xs font-semibold">
                LIVE
              </span>
            </div>

          </div>

          {/* DRIVER INFO */}

          <div className="mt-5 bg-white/10 rounded-2xl p-4">

            <div className="flex justify-between">

              <span className="text-white/70 text-sm">
                Drivers Found
              </span>

              <span className="text-white font-bold">
                {driversFound}
              </span>

            </div>

            <div className="flex justify-between mt-3">

              <span className="text-white/70 text-sm">
                Estimated Arrival
              </span>

              <span className="text-white font-bold">
                3-5 mins
              </span>

            </div>

          </div>

          {/* PROGRESS BAR */}

          <div className="mt-5">

            <div className="w-full h-2 bg-white/10 rounded-full">

              <div
                className={`h-2 bg-[#FF8A00] rounded-full transition-all duration-1000 ${
                  step === 1
                    ? "w-[25%]"
                    : step === 2
                    ? "w-[50%]"
                    : step === 3
                    ? "w-[75%]"
                    : "w-full"
                }`}
              />

            </div>

          </div>

          {/* STEPS */}

          <div className="space-y-4 mt-6">

            <div className="flex items-center gap-3">
              <CheckCircle2
                className="text-green-400"
                size={20}
              />
              <span className="text-white text-sm">
                Ride Request Sent
              </span>
            </div>

            <div className="flex items-center gap-3">
              {step >= 2 ? (
                <CheckCircle2
                  className="text-green-400"
                  size={20}
                />
              ) : (
                <Loader2
                  size={20}
                  className="animate-spin text-[#FF8A00]"
                />
              )}

              <span className="text-white text-sm">
                Searching Nearby Drivers
              </span>
            </div>

            <div className="flex items-center gap-3">
              {step >= 3 ? (
                <CheckCircle2
                  className="text-green-400"
                  size={20}
                />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/30" />
              )}

              <span className="text-white text-sm">
                Driver Responding
              </span>
            </div>

            <div className="flex items-center gap-3">
              {step >= 4 ? (
                <CheckCircle2
                  className="text-green-400"
                  size={20}
                />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/30" />
              )}

              <span className="text-white text-sm">
                Ride Confirmation
              </span>
            </div>

          </div>

          {/* MODE */}

          <div className="mt-6 bg-[#0F6B4B]/30 border border-[#0F6B4B] rounded-xl p-3">

            <div className="flex justify-between">

              <span className="text-white text-sm">
                Booking Mode
              </span>

              <span className="text-green-300 font-semibold">
                {navigator.onLine ? "INTERNET" : "SMS"}
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SearchingDriver;