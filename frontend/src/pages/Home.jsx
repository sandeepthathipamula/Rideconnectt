import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Search,
    Home,
    Building2,
    Plane,
    Train,
    Bike,
    Car,
    User,
    CreditCard,
    Clock3,
    ShieldAlert,
    ChevronDown,
    UserCircle2,
} from "lucide-react";

const HomePage = () => {
    const navigate = useNavigate();

    const [selectedRide, setSelectedRide] = useState("mini");

    const [pickupLat, setPickupLat] = useState(null);
    const [pickupLng, setPickupLng] = useState(null);

    const [pickupLocation, setPickupLocation] =
        useState("Fetching GPS...");

    const [dropLocation, setDropLocation] =
        useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setPickupLocation("GPS Not Supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setPickupLat(lat);
                setPickupLng(lng);

                setPickupLocation(
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                );
            },
            () => {
                setPickupLocation(
                    "Unable to fetch GPS"
                );
            },
            {
                enableHighAccuracy: true,
            }
        );
    }, []);

    const rideTypes = [
        { id: "bike", label: "Bike", icon: Bike },
        { id: "auto", label: "Auto", icon: Car },
        { id: "mini", label: "Mini", icon: Car },
        { id: "sedan", label: "Sedan", icon: Car },
        { id: "suv", label: "SUV", icon: Car },
    ];



    const handleContinue = async () => {
        if (!pickupLat || !pickupLng) {
            alert("GPS not available");
            return;
        }

        if (!dropLocation.trim()) {
            alert("Enter destination");
            return;
        }

        try {
            const mobile = localStorage.getItem("mobile");

            const response = await axios.post(
                "http://localhost:8000/create-ride",
                {
                    mobile: mobile,
                    pickup_address: pickupLocation,
                    pickup_lat: pickupLat,
                    pickup_lng: pickupLng,
                    drop_location: dropLocation,
                    ride_type: selectedRide,
                    booking_mode: navigator.onLine ? "INTERNET" : "SMS",
                }
            );
            localStorage.setItem("pickup_lat", pickupLat);
            localStorage.setItem("pickup_lng", pickupLng);
            localStorage.setItem("drop_address", dropLocation);
            if (response.data.success) {
                localStorage.setItem(
                    "rideId",
                    response.data.ride_id
                );

                navigate("/searching-driver", { replace: true, state: { rideId: response.data.ride_id } });
            } else {
                alert(response.data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Failed to create ride");
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-4">

            <div className="w-[340px] h-[740px] bg-[#F8F6F1] rounded-[32px] shadow-2xl overflow-hidden relative">

                {/* HEADER */}

                <div className="px-4 pt-5 flex justify-between items-center">

                    <div className="flex items-center gap-2">

                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                            <MapPin
                                size={14}
                                className="text-[#0F6B4B]"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-[15px]">
                                Hyderabad
                            </span>

                            <ChevronDown size={16} />
                        </div>

                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#E8F3EE] flex items-center justify-center">
                        <UserCircle2
                            size={24}
                            className="text-[#0F6B4B]"
                        />
                    </div>

                </div>

                {/* SMS Banner */}

                <div className="mx-4 mt-4 bg-gradient-to-r from-[#0F6B4B] to-[#145A43] rounded-2xl p-3 text-white">

                    <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center">
                            💬
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm">
                                No Internet?
                            </h3>

                            <p className="text-[11px] opacity-90">
                                You can still book rides using SMS
                            </p>
                        </div>

                    </div>

                </div>

                {/* Book Ride */}

                <div className="mx-4 mt-4">
                    <button className="w-full bg-white rounded-2xl py-3 text-sm font-semibold shadow-sm border border-gray-100">
                        Book a Ride
                    </button>
                </div>

                {/* Pickup */}

                <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">

                    <div className="flex gap-3">

                        <MapPin
                            size={18}
                            className="text-green-600 mt-1"
                        />

                        <div className="flex-1">

                            <p className="text-xs text-gray-500">
                                Pickup Location
                            </p>

                            <h4 className="font-semibold text-sm mt-1">
                                Current GPS Location
                            </h4>

                            <p className="text-xs text-gray-500 mt-1 break-all">
                                {pickupLocation}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Drop */}

                <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">

                    <div className="flex gap-3 items-center">

                        <MapPin
                            size={18}
                            className="text-red-500"
                        />

                        <div className="flex-1">

                            <p className="text-xs text-gray-500">
                                Drop Location
                            </p>

                            <input
                                type="text"
                                value={dropLocation}
                                onChange={(e) =>
                                    setDropLocation(
                                        e.target.value
                                    )
                                }
                                placeholder="Where are you going?"
                                className="w-full outline-none text-sm font-medium mt-1"
                            />

                        </div>

                        <Search
                            size={18}
                            className="text-gray-400"
                        />

                    </div>

                </div>

                {/* Recent */}

                <div className="px-4 mt-4">

                    <p className="text-xs text-gray-500 mb-2">
                        Recent Places
                    </p>

                    <div className="grid grid-cols-4 gap-2">

                        <div className="bg-white rounded-xl h-10 flex items-center justify-center gap-1 text-[11px] border">
                            <Home size={12} />
                            Home
                        </div>

                        <div className="bg-white rounded-xl h-10 flex items-center justify-center gap-1 text-[11px] border">
                            <Building2 size={12} />
                            Office
                        </div>

                        <div className="bg-white rounded-xl h-10 flex items-center justify-center gap-1 text-[11px] border">
                            <Plane size={12} />
                            Airport
                        </div>

                        <div className="bg-white rounded-xl h-10 flex items-center justify-center gap-1 text-[11px] border">
                            <Train size={12} />
                            Railway
                        </div>

                    </div>

                </div>

                {/* Ride Type */}

                <div className="px-4 mt-5">

                    <h3 className="font-semibold mb-3">
                        Ride Type
                    </h3>

                    <div className="grid grid-cols-5 gap-2">

                        {rideTypes.map((ride) => {
                            const Icon = ride.icon;

                            return (
                                <button
                                    key={ride.id}
                                    onClick={() =>
                                        setSelectedRide(
                                            ride.id
                                        )
                                    }
                                    className={`h-16 rounded-xl border flex flex-col items-center justify-center ${selectedRide === ride.id
                                        ? "bg-[#FFE7C7] border-[#FF8A00]"
                                        : "bg-white border-gray-200"
                                        }`}
                                >
                                    <Icon size={18} />

                                    <span className="text-[10px] mt-1">
                                        {ride.label}
                                    </span>

                                </button>
                            );
                        })}

                    </div>

                </div>

                {/* Continue */}

                <div className="px-4 mt-6">

                    <button
                        onClick={handleContinue}
                        className="w-full h-12 rounded-xl bg-[#FF8A00] text-white font-semibold"
                    >
                        Continue
                    </button>

                </div>

                {/* Bottom Nav */}

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t h-[70px] flex items-center justify-around">

                    <div className="flex flex-col items-center text-[#0F6B4B]">
                        <Home size={18} />
                        <span className="text-[10px]">
                            Home
                        </span>
                    </div>

                    <div className="flex flex-col items-center text-gray-500">
                        <Clock3 size={18} />
                        <span className="text-[10px]">
                            Rides
                        </span>
                    </div>

                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">

                        <button className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                            <ShieldAlert size={22} />
                        </button>

                    </div>

                    <div className="flex flex-col items-center text-gray-500">
                        <CreditCard size={18} />
                        <span className="text-[10px]">
                            Payments
                        </span>
                    </div>

                    <div className="flex flex-col items-center text-gray-500">
                        <User size={18} />
                        <span className="text-[10px]">
                            Profile
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};


export default HomePage;