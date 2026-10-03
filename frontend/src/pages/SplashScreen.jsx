import { Wifi, MessageSquare, Satellite } from "lucide-react";
import splashBg from "../assets/splash-bg.jpeg";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SplashScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login',{replace: true});
        }, 3000);
        // return () => clearTimeout(timer);
    }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="relative w-[340px] h-[740px] overflow-hidden rounded-[36px] shadow-2xl">

        {/* Background */}
        <img
          src={splashBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center">

          {/* Logo */}
          <div className="mt-20">
            <div className="text-white text-7xl font-black">
              R
            </div>
          </div>

          {/* Title */}
          <h1 className="text-white text-4xl font-bold mt-4">
            RideConnect
          </h1>

          <p className="text-white/80 text-sm mt-2">
            Rides Beyond Connectivity
          </p>

          {/* Bottom Content */}
          <div className="mt-auto mb-12 text-center">

            <h2 className="text-white text-2xl font-semibold">
              Your Ride
            </h2>

            <p className="text-white/80">
              Anytime, Anywhere
            </p>

            <div className="flex justify-center gap-8 mt-8">

              <div className="flex flex-col items-center text-green-400">
                <Wifi size={26} />
                <span className="text-xs mt-2 text-white">
                  Online
                </span>
              </div>

              <div className="flex flex-col items-center text-yellow-400">
                <MessageSquare size={26} />
                <span className="text-xs mt-2 text-white">
                  SMS
                </span>
              </div>

              <div className="flex flex-col items-center text-blue-400">
                <Satellite size={26} />
                <span className="text-xs mt-2 text-white">
                  Satellite
                </span>
              </div>

            </div>

            <div className="w-48 h-1 bg-white/20 rounded-full mt-8 mx-auto">
              <div className="w-20 h-full bg-orange-500 rounded-full"></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}