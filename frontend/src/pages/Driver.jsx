import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Star,
  Car,
  FileText,
  HelpCircle,
  Bell,
  Home,
  User,
  Clock,
  DollarSign,
} from "lucide-react";

const DriverDashboard = () => {
  const [online, setOnline] = useState(true);

  const [rides, setRides] = useState([]);

  const [showRequests, setShowRequests] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchRides();

    const interval = setInterval(() => {
      fetchRides();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const driverId = localStorage.getItem("driverId") || 1;

  const fetchRides = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/available-rides"
      );

      if (res.data.success) {
        setRides(res.data.rides);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRide = async (rideId) => {
    try {

      const driverId =
        localStorage.getItem("driverId") || 1;

      const res = await axios.post(
        "http://localhost:8000/accept-ride",
        {
          ride_id: rideId,
          driver_id: driverId,
        }
      );

      if (res.data.success) {

        navigate("/driver-navigation", {
          state: {
            rideId: res.data.ride_id,

            pickupLat: res.data.pickup_lat,
            pickupLng: res.data.pickup_lng,

            dropLat: res.data.drop_lat,
            dropLng: res.data.drop_lng,

            pickupAddress:
              res.data.pickup_address,

            dropAddress:
              res.data.drop_address,
          },


        });
        localStorage.setItem("ride_id", res.data.ride_id);

      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.log(err);
    }

  };

  const rejectRide = (rideId) => {
    setRides((prev) =>
      prev.filter((ride) => ride.id !== rideId)
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-[360px] h-screen bg-[#F7F8FA] relative overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.15)]">

        {/* HEADER */}
        <div className="bg-[#0F6A46] px-5 pt-10 pb-24 rounded-b-[30px]">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-green-100 text-sm">
                Good Morning,
              </p>

              <h2 className="text-white font-bold text-2xl mt-1">
                Ravi Kumar
              </h2>

              <p className="text-green-200 text-sm mt-1">
                Driver Partner
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">

              <span className="text-white text-sm font-medium">
                {online ? "Online" : "Offline"}
              </span>

              <div
                onClick={() => setOnline(!online)}
                className={`w-14 h-8 rounded-full cursor-pointer flex items-center px-1 transition-all ${online
                  ? "bg-green-400"
                  : "bg-gray-400"
                  }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-all ${online
                    ? "translate-x-6"
                    : ""
                    }`}
                />
              </div>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="px-4 -mt-14">

          <div className="bg-white rounded-3xl shadow-lg p-4">

            <div className="grid grid-cols-3">

              <div className="text-center border-r border-slate-100">
                <Wallet
                  size={20}
                  className="mx-auto text-green-700 mb-1"
                />

                <h3 className="font-bold text-lg">
                  ₹1560
                </h3>

                <p className="text-xs text-gray-500">
                  Earnings
                </p>
              </div>

              <div className="text-center border-r border-slate-100">
                <Car
                  size={20}
                  className="mx-auto text-green-700 mb-1"
                />

                <h3 className="font-bold text-lg">
                  12
                </h3>

                <p className="text-xs text-gray-500">
                  Rides
                </p>
              </div>

              <div className="text-center">
                <Star
                  size={20}
                  className="mx-auto text-yellow-500 mb-1"
                />

                <h3 className="font-bold text-lg">
                  4.8
                </h3>

                <p className="text-xs text-gray-500">
                  Rating
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="px-4 mt-4 space-y-3">

          {/* NEW RIDES */}

          <div
            onClick={() =>
              setShowRequests(!showRequests)
            }
            className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Bell
                size={20}
                className="text-orange-500"
              />

              <span className="font-medium">
                New Ride Requests
              </span>
            </div>

            {rides.length > 0 && (
              <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {rides.length}
              </div>
            )}
          </div>

          {/* RIDE REQUESTS */}

          {showRequests && (
            <div className="space-y-3">

              {rides.length === 0 ? (

                <div className="bg-white rounded-2xl p-5 text-center text-gray-500 shadow-sm">
                  No Ride Requests Available
                </div>

              ) : (

                rides.map((ride) => (

                  <div
                    key={ride.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <h3 className="font-bold text-slate-800">
                      Ride #{ride.id}
                    </h3>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        PICKUP
                      </p>

                      <p className="font-medium">
                        {ride.pickup}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        DROP
                      </p>

                      <p className="font-medium">
                        {ride.drop}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        VEHICLE
                      </p>

                      <p className="font-medium">
                        {ride.ride_type}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() =>
                          acceptRide(ride.id)
                        }
                        className="flex-1 h-11 bg-green-600 text-white rounded-xl font-semibold"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          rejectRide(ride.id)
                        }
                        className="flex-1 h-11 bg-red-500 text-white rounded-xl font-semibold"
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>
          )}

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <DollarSign className="text-green-600" />
            <span>My Earnings</span>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <Clock className="text-blue-600" />
            <span>Ride History</span>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <FileText className="text-purple-600" />
            <span>Vehicle & Documents</span>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm mb-24">
            <HelpCircle className="text-orange-500" />
            <span>Help & Support</span>
          </div>

        </div>

        {/* BOTTOM NAV */}

        <div className="fixed bottom-0 w-[360px] bg-white border-t">

          <div className="grid grid-cols-4 py-3">

            <div className="flex flex-col items-center text-green-700">
              <Home size={22} />
              <span className="text-xs mt-1">
                Home
              </span>
            </div>

            <div className="flex flex-col items-center text-gray-400">
              <Wallet size={22} />
              <span className="text-xs mt-1">
                Earnings
              </span>
            </div>

            <div className="flex flex-col items-center text-gray-400">
              <Car size={22} />
              <span className="text-xs mt-1">
                Rides
              </span>
            </div>

            <div className="flex flex-col items-center text-gray-400">
              <User size={22} />
              <span className="text-xs mt-1">
                Profile
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DriverDashboard;