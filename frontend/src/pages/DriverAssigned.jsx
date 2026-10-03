 import React, { useEffect, useState } from "react";
import {
  MapPin,
  Share2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const DriverAssigned = () => {
  const [ride, setRide] = useState(null);

  const location = useLocation();

  const rideId =
    location.state?.rideId ||
    localStorage.getItem("ride_id");

  useEffect(() => {
    fetchRideDetails();

    const interval = setInterval(() => {
      fetchRideDetails();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/ride-status/${rideId}`
      );

      const data = await response.json();

      if (data.success) {
        setRide(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelRide = async () => {
    try {
      await fetch(
        `http://localhost:8000/cancel-ride/${rideId}`,
        {
          method: "POST",
        }
      );

      localStorage.removeItem("ride_id");
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
    }
  };

  const shareRide = async () => {
    try {
      await navigator.share({
        title: "RideConnect Ride",
        text: `
Driver: ${ride.driver_name}
Vehicle: ${ride.vehicle_type}
OTP: ${ride.otp}
        `,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!ride) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="bg-white rounded-[30px] px-8 py-6 shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-700">
            Searching Driver...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex justify-center">
      {/* <div className="w-[340px] bg-white border rounded-[16px] min-h-screen px-4 pt-8 pb-24"> */}
      <div className="w-[340px] bg-white rounded-[16px] min-h-screen px-4 pt-8 pb-24">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft
            size={22}
            className="text-slate-700 cursor-pointer"
          />

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Driver Assigned
            </h1>

            <p className="text-sm text-slate-500">
              Driver arriving in 4 mins
            </p>
          </div>
        </div>

        {/* Driver Card */}
        <div className="bg-white rounded-[30px] border border-slate-200 shadow-sm p-5">

          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">
            Driver Details
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            {ride.driver_name}
          </h2>

          <p className="text-slate-500 mt-1">
            {ride.vehicle_type}
          </p>

          <div className="mt-4 inline-flex items-center px-4 py-2 bg-slate-100 rounded-xl">
            <span className="font-semibold text-slate-800">
              TS09AB1234
            </span>
          </div>

        </div>

        {/* OTP Card */}
        <div className="mt-4 bg-gradient-to-r from-[#0F6B4B] to-[#12805A] rounded-[30px] p-6 text-center shadow-sm">

          <p className="text-green-100 text-sm">
            Verification OTP
          </p>

          <h1 className="text-[58px] font-black tracking-[12px] text-white mt-3">
            {ride.otp}
          </h1>

          <p className="text-green-100 text-sm mt-2">
            Show this OTP to driver
          </p>

        </div>

        {/* Trip Details */}
        <div className="mt-4 bg-white rounded-[30px] border border-slate-200 shadow-sm p-5">

          <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-5">
            Trip Details
          </h3>

          <div className="flex gap-3">

            <MapPin
              size={20}
              className="text-green-600 mt-1"
            />

            <div>
              <p className="text-xs text-slate-400">
                Pickup Location
              </p>

              <h3 className="font-medium text-slate-900">
                {ride.pickup_address}
              </h3>
            </div>

          </div>

          <div className="h-10 border-l-2 border-dashed border-slate-300 ml-[9px] my-2"></div>

          <div className="flex gap-3">

            <MapPin
              size={20}
              className="text-red-500 mt-1"
            />

            <div>
              <p className="text-xs text-slate-400">
                Drop Location
              </p>

              <h3 className="font-medium text-slate-900">
                {ride.drop_address}
              </h3>
            </div>

          </div>

        </div>

        {/* Ride Progress */}
        <div className="mt-4 bg-white rounded-[30px] border border-slate-200 shadow-sm p-5">

          <h3 className="font-semibold text-slate-900 mb-6">
            Ride Progress
          </h3>

          <div className="flex items-center">

            <div className="w-4 h-4 rounded-full bg-[#0F6B4B]" />

            <div className="flex-1 h-[3px] bg-[#0F6B4B]" />

            <div className="w-4 h-4 rounded-full bg-[#0F6B4B]" />

            <div className="flex-1 h-[3px] bg-slate-200" />

            <div className="w-4 h-4 rounded-full bg-slate-200" />

            <div className="flex-1 h-[3px] bg-slate-200" />

            <div className="w-4 h-4 rounded-full bg-slate-200" />

          </div>

          <div className="flex justify-between mt-4 text-[11px] text-slate-500">
            <span>Assigned</span>
            <span>Arriving</span>
            <span>Started</span>
            <span>Done</span>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            onClick={shareRide}
            className="h-12 rounded-2xl border border-slate-300 bg-white text-slate-700 font-medium flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Ride
          </button>

          <button
            onClick={cancelRide}
            className="h-12 rounded-2xl bg-red-500 text-white font-medium flex items-center justify-center gap-2"
          >
            <XCircle size={18} />
            Cancel Ride
          </button>

        </div>

      </div>
    </div>
  );
};

export default DriverAssigned;