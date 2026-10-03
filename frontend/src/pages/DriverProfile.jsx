 import React, { useState } from "react";
import axios from "axios";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DriverProfile = () => {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("driverMobile") || "6300216734";

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("Bike");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const saveProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/driver-profile",
        {
          mobile,
          name,
          vehicle_type: vehicleType,
          vehicle_number: vehicleNumber,
        }
      );

      if (response.data.success) {
        alert("Profile Saved Successfully");
        navigate("/driver");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to Save Profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center px-4">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-green-700 px-6 py-8 text-white">

          <button
            onClick={() => navigate(-1)}
            className="mb-5"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold">
            Driver Profile
          </h1>

          <p className="text-green-100 mt-1 text-sm">
            Complete your profile to start accepting rides
          </p>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-10">

          <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center">

            {name ? (
              <span className="text-2xl font-bold text-green-700">
                {name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User
                size={34}
                className="text-green-700"
              />
            )}

          </div>
        </div>

        {/* Form */}
        <div className="p-6">

          <div className="space-y-5">

            {/* Driver Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Driver Name
              </label>

              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-100
                  outline-none
                "
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Mobile Number
              </label>

              <input
                value={`+91 ${mobile}`}
                readOnly
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  bg-green-50
                  border
                  border-green-200
                  font-medium
                  text-gray-700
                "
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Vehicle Type
              </label>

              <select
                value={vehicleType}
                onChange={(e) =>
                  setVehicleType(e.target.value)
                }
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-100
                  outline-none
                "
              >
                <option>Bike</option>
                <option>Auto</option>
                <option>Mini</option>
                <option>Sedan</option>
                <option>SUV</option>
              </select>
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Vehicle Number
              </label>

              <input
                type="text"
                placeholder="TS09AB1234"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(
                    e.target.value.toUpperCase()
                  )
                }
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-100
                  outline-none
                "
              />
            </div>

            {/* Button */}
            <button
              onClick={saveProfile}
              className="
                w-full
                h-14
                mt-2
                rounded-xl
                bg-green-700
                hover:bg-green-800
                text-white
                font-semibold
                shadow-lg
                transition
              "
            >
              Save & Continue
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DriverProfile;