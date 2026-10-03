import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from "react-leaflet";

import L from "leaflet";
import { getDistance } from "geolib";
import "leaflet/dist/leaflet.css";

const DriverNavigation = () => {

    const [ride, setRide] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);

    const rideId = localStorage.getItem("rideId");

    // Demo Driver Location
    const DRIVER_LAT = 17.4435;
    const DRIVER_LNG = 78.3772;

    const PICKUP_LAT = Number(
        localStorage.getItem("pickup_lat")
    );

    const PICKUP_LNG = Number(
        localStorage.getItem("pickup_lng")
    );

    useEffect(() => {
        fetchRide();
    }, []);

    const fetchRide = async () => {
        try {

            const response = await fetch(
                `http://localhost:8000/ride-status/${rideId}`
            );

            const data = await response.json();

            if (data.success) {

                setRide(data);

                const coords =
                    await getCoordinatesFromAddress(
                        data.drop_address
                    );

                setDropCoords(coords);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const getCoordinatesFromAddress = async (address) => {
        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    address + ", Hyderabad"
                )}`
            );

            const data = await response.json();

            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
            }

            return null;

        } catch (error) {
            console.log(error);
            return null;
        }
    };

    if (!ride || !dropCoords) {
        return (
            <div className="h-screen flex justify-center items-center">
                Loading Navigation...
            </div>
        );
    }

    // Driver -> Pickup
    const driverDistance =
        getDistance(
            {
                latitude: DRIVER_LAT,
                longitude: DRIVER_LNG,
            },
            {
                latitude: PICKUP_LAT,
                longitude: PICKUP_LNG,
            }
        ) / 1000;

    // Pickup -> Drop
    const tripDistance =
        getDistance(
            {
                latitude: PICKUP_LAT,
                longitude: PICKUP_LNG,
            },
            {
                latitude: dropCoords.lat,
                longitude: dropCoords.lng,
            }
        ) / 1000;

    const eta =
        Math.round(driverDistance * 3);

    const fare =
        Math.round(40 + tripDistance * 12);

    const driverIcon = new L.Icon({
        iconUrl:
            "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [40, 40],
    });

    const pickupIcon = new L.Icon({
        iconUrl:
            "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [40, 40],
    });

    const dropIcon = new L.Icon({
        iconUrl:
            "https://cdn-icons-png.flaticon.com/512/535/535188.png",
        iconSize: [40, 40],
    });

    const openNavigation = () => {

        window.open(
            `https://www.google.com/maps/dir/${DRIVER_LAT},${DRIVER_LNG}/${PICKUP_LAT},${PICKUP_LNG}`,
            "_blank"
        );
    };

    return (
        <div className="bg-slate-100 min-h-screen flex justify-center">

            <div className="w-[390px] bg-white min-h-screen">

                {/* Header */}

                <div className="bg-[#0F6B4B] p-5 text-white">

                    <h1 className="text-2xl font-bold">
                        Driver Navigation
                    </h1>

                    <p className="text-sm opacity-90">
                        Navigate to Passenger
                    </p>

                </div>

                {/* MAP */}

                <MapContainer
                    center={[PICKUP_LAT, PICKUP_LNG]}
                    zoom={12}
                    style={{
                        height: "320px",
                        width: "100%",
                    }}
                >

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Driver */}

                    <Marker
                        position={[
                            DRIVER_LAT,
                            DRIVER_LNG,
                        ]}
                        icon={driverIcon}
                    >
                        <Popup>
                            Driver Location
                        </Popup>
                    </Marker>

                    {/* Pickup */}

                    <Marker
                        position={[
                            PICKUP_LAT,
                            PICKUP_LNG,
                        ]}
                        icon={pickupIcon}
                    >
                        <Popup>
                            Passenger Pickup
                        </Popup>
                    </Marker>

                    {/* Drop */}

                    <Marker
                        position={[
                            dropCoords.lat,
                            dropCoords.lng,
                        ]}
                        icon={dropIcon}
                    >
                        <Popup>
                            Drop Location
                        </Popup>
                    </Marker>

                    {/* Driver -> Pickup */}

                    <Polyline
                        positions={[
                            [
                                DRIVER_LAT,
                                DRIVER_LNG,
                            ],
                            [
                                PICKUP_LAT,
                                PICKUP_LNG,
                            ],
                        ]}
                    />

                    {/* Pickup -> Drop */}

                    <Polyline
                        positions={[
                            [
                                PICKUP_LAT,
                                PICKUP_LNG,
                            ],
                            [
                                dropCoords.lat,
                                dropCoords.lng,
                            ],
                        ]}
                        color="green"
                    />

                </MapContainer>

                <div className="p-4 space-y-4">

                    <div className="bg-slate-50 p-4 rounded-3xl">

                        <p className="text-xs text-slate-500">
                            PICKUP
                        </p>

                        <h3 className="font-semibold">
                            {ride.pickup_address}
                        </h3>

                    </div>

                    <div className="bg-slate-50 p-4 rounded-3xl">

                        <p className="text-xs text-slate-500">
                            DROP
                        </p>

                        <h3 className="font-semibold">
                            {ride.drop_address}
                        </h3>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                        <div className="border rounded-3xl p-4">

                            <p className="text-xs text-slate-500">
                                DRIVER DISTANCE
                            </p>

                            <h2 className="text-2xl font-bold">
                                {driverDistance.toFixed(1)} km
                            </h2>

                        </div>

                        <div className="border rounded-3xl p-4">

                            <p className="text-xs text-slate-500">
                                ETA
                            </p>

                            <h2 className="text-2xl font-bold">
                                {eta} min
                            </h2>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                        <div className="border rounded-3xl p-4">

                            <p className="text-xs text-slate-500">
                                TRIP DISTANCE
                            </p>

                            <h2 className="text-2xl font-bold">
                                {tripDistance.toFixed(1)} km
                            </h2>

                        </div>

                        <div className="border rounded-3xl p-4">

                            <p className="text-xs text-slate-500">
                                EST. FARE
                            </p>

                            <h2 className="text-2xl font-bold text-green-700">
                                ₹{fare}
                            </h2>

                        </div>

                    </div>

                    <button
                        onClick={openNavigation}
                        className="w-full h-14 bg-[#0F6B4B] text-white rounded-2xl font-semibold"
                    >
                        Start Navigation
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DriverNavigation;